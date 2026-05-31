import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { FileSearchIcon, InformationSquareIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, HStack, InfoCard, List, Modal, Radio, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { Opphørsårsak, opphørsårsakLabels } from './types.js';

interface FormData {
  perioder: Record<
    string,
    {
      opphørsdato: string;
      opphørsårsak: string;
      begrunnelse: string;
      åpenbarGrunnTilIkkeVarsle: 'ja' | 'nei' | '';
    }
  >;
}

const buildInitialValues = (vilkår: VilkårMedPerioderDto): FormData => ({
  perioder: Object.fromEntries(
    (vilkår.perioder ?? []).map(p => [
      p.periode.fom,
      {
        opphørsdato: p.periode.tom ?? '',
        opphørsårsak: '',
        begrunnelse: p.begrunnelse ?? '',
        åpenbarGrunnTilIkkeVarsle: '',
      },
    ]),
  ),
});

interface Props {
  vurderBostedAp: AksjonspunktDto | undefined;
  bostedVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}

export const AarsakOgVarsel = ({
  vurderBostedAp,
  bostedVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: Props) => {
  const periods: VilkårSplittPanelPeriod[] = (bostedVilkår.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getPeriodStatus(p.vilkarStatus),
    label: formatDate(p.periode.fom),
    periode: p.periode,
  }));

  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const [visBekreftSubmitModal, setVisBekreftSubmitModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<FormData | null>(null);

  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(bostedVilkår),
  });
  const åpenbarGrunnTilIkkeVarsle = formHook.watch(`perioder.${selectedId}.åpenbarGrunnTilIkkeVarsle`);

  const isVarselApSolved = vurderBostedAp?.status === AksjonspunktStatus.UTFØRT;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const periode = data.perioder[selectedId];
      const selectedItem = periods.find(period => period.id === selectedId);
      if (!periode) {
        throw new Error('Kunne ikke finne valgt periode for opphør');
      }
      if (!selectedItem) {
        throw new Error('Kunne ikke finne valgt periode for opphør');
      }

      const payload: BekreftetAksjonspunktDto = {
        '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED,
        begrunnelse: periode.begrunnelse,
        avklaringer: [
          {
            periode: selectedItem.periode,
            skalIkkeSendeVarsel: åpenbarGrunnTilIkkeVarsle === 'ja',
            vurdering: {
              begrunnelse: periode.begrunnelse,
              borITrondheimIHelePerioden: false,
              fraflyttingsDato: periode.opphørsdato || undefined,
            },
          },
        ],
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const skalSendeForhåndsvarsel = åpenbarGrunnTilIkkeVarsle === 'nei';

  return (
    <VStack gap="space-20">
      {!isVarselApSolved && vurderBostedAp && (
        <Alert variant="warning" size="small">
          Vurder årsak til opphør og om bruker skal varsles.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Årsak og varsel for opphør"
        lovreferanse={bostedVilkår.lovReferanse}
        defaultIsLocked={isVarselApSolved}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        lockedContent={isVarselApSolved ? <VurdertAv ident={vurderBostedAp?.ansvarligSaksbehandler} /> : undefined}
      >
        {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => (
          <>
            <RhfForm
              formMethods={formHook}
              onSubmit={async data => {
                if (skalSendeForhåndsvarsel) {
                  setPendingSubmitData(data);
                  setVisBekreftSubmitModal(true);
                  return;
                }

                await bekreftAksjonspunktMutation(data);
                setIsFormLocked(true);
              }}
            >
              <VStack gap="space-24" width="70ch">
                <RhfDatepicker
                  control={formHook.control}
                  name={`perioder.${selectedId}.opphørsdato`}
                  label="Dato for opphør"
                  readOnly={isFormLocked}
                  validate={[required]}
                />
                <RhfSelect
                  control={formHook.control}
                  name={`perioder.${selectedId}.opphørsårsak`}
                  label="Opphørsårsak"
                  readOnly={isFormLocked}
                  validate={[required]}
                  selectValues={Object.values(Opphørsårsak).map(årsak => (
                    <option key={årsak} value={årsak}>
                      {opphørsårsakLabels[årsak]}
                    </option>
                  ))}
                />
                <RhfTextarea
                  control={formHook.control}
                  name={`perioder.${selectedId}.begrunnelse`}
                  label="Begrunnelse for opphør"
                  readOnly={isFormLocked}
                  validate={[required]}
                />
                <RhfRadioGroup
                  key={`${selectedId}-varsle`}
                  control={formHook.control}
                  name={`perioder.${selectedId}.åpenbarGrunnTilIkkeVarsle`}
                  legend="Er det åpenbar grunn til å ikke varsle bruker om opphør?"
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value="ja">Ja</Radio>
                  <Radio value="nei">Nei</Radio>
                </RhfRadioGroup>
                {!isFormLocked && skalSendeForhåndsvarsel && (
                  <InfoCard data-color="info" size="small">
                    <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                      <InfoCard.Title>Bruker vil få ett forhåndsvarsel om opphør</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content>
                      <List size="small">
                        <List.Item>
                          Når du går videre sendes det ett forhåndsvarsel til bruker med dato og årsak for opphør.
                        </List.Item>
                        <List.Item>
                          Saken settes på vent til bruker svarer på forhåndsvarsel eller det har gått 14 dager.
                        </List.Item>
                      </List>
                    </InfoCard.Content>
                  </InfoCard>
                )}
                {!isFormLocked && (
                  <HStack gap="space-24">
                    <Button type="submit" size="small" loading={isPending}>
                      Bekreft og fortsett
                    </Button>
                    {skalSendeForhåndsvarsel && (
                      <Button
                        size="small"
                        variant="secondary"
                        type="button"
                        icon={<FileSearchIcon aria-hidden fontSize="1.5rem" />}
                      >
                        Forhåndsvis varsel
                      </Button>
                    )}
                  </HStack>
                )}
              </VStack>
            </RhfForm>
            {visBekreftSubmitModal && (
              <Modal
                open
                aria-label="Send forhåndsvarsel"
                onClose={() => setVisBekreftSubmitModal(false)}
                header={{ heading: 'Send forhåndsvarsel', size: 'small' }}
              >
                <Modal.Body>
                  <VStack gap="space-16">
                    <BodyShort size="small">
                      Er du sikker på at du vil sende forhåndsvarsel? <br /> Dette kan ikke angres.
                    </BodyShort>
                  </VStack>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    size="small"
                    loading={isPending}
                    onClick={async () => {
                      if (!pendingSubmitData) {
                        return;
                      }

                      await bekreftAksjonspunktMutation(pendingSubmitData);
                      setVisBekreftSubmitModal(false);
                      setPendingSubmitData(null);
                      setIsFormLocked(true);
                    }}
                  >
                    Send forhåndsvarsel
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setVisBekreftSubmitModal(false);
                      setPendingSubmitData(null);
                    }}
                  >
                    Avbryt
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
