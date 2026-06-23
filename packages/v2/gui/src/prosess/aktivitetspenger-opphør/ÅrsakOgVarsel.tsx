import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BostedGrunnlagResponseDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { FileSearchIcon, InformationSquareIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, HStack, InfoCard, List, Modal, Radio, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VilkårSplittPanel, type VilkårSplittPanelPeriod } from '../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { BostedsvilkårIkkeOppfyltÅrsak, opphørsårsakLabels } from '../aktivitetspenger-prosess/types.js';

interface FormData {
  perioder: Record<
    string,
    {
      opphørsdato: string;
      årsak: string;
      begrunnelse: string;
      åpenbarGrunnTilIkkeVarsle: 'ja' | 'nei' | '';
    }
  >;
}

const buildInitialValues = (periods: VilkårSplittPanelPeriod[]): FormData => ({
  perioder: Object.fromEntries(
    (periods ?? []).map(p => [
      p.id,
      {
        opphørsdato: '',
        årsak: '',
        begrunnelse: '',
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
  bostedGrunnlag: BostedGrunnlagResponseDto;
}

export const AarsakOgVarsel = ({
  vurderBostedAp,
  bostedVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
  bostedGrunnlag,
}: Props) => {
  const isVurderBostedApOpen = vurderBostedAp !== undefined && vurderBostedAp.status !== AksjonspunktStatus.UTFØRT;

  const periods: VilkårSplittPanelPeriod[] = [
    ...(isVurderBostedApOpen
      ? [
          {
            id: 'ikke-satt',
            status: 'warning' as const,
            label: 'Ikke satt',
          },
        ]
      : []),
    ...(bostedGrunnlag.perioder ?? []).map(p => ({
      id: p.fom,
      status: p.resultat?.erBosatt ? ('success' as const) : ('error' as const),
      label: p.tom ? `${formatDate(p.fom)} - ${formatDate(p.tom)}` : formatDate(p.fom),
      periode: p.tom
        ? {
            fom: p.fom,
            tom: p.tom,
          }
        : undefined,
    })),
  ];

  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const [visBekreftSubmitModal, setVisBekreftSubmitModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<FormData | null>(null);

  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(periods),
  });
  const åpenbarGrunnTilIkkeVarsle = formHook.watch(`perioder.${selectedId}.åpenbarGrunnTilIkkeVarsle`);
  const opphøreEllerAvslå = formHook.watch(`perioder.${selectedId}.opphøreEllerAvslå`);
  const valgtÅrsak = formHook.watch(`perioder.${selectedId}.årsak`);
  const valgtÅrsakErAnnet = valgtÅrsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET;

  const isVarselApSolved = vurderBostedAp?.status === AksjonspunktStatus.UTFØRT;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const selectedFormPeriod = formData.perioder[selectedId];
      if (!selectedFormPeriod) {
        throw new Error('Kunne ikke finne valgt periode for opphør');
      }

      const payload: BekreftetAksjonspunktDto = {
        '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED,
        begrunnelse: selectedFormPeriod.begrunnelse,
        avklaringer: [
          {
            periode: {
              fom: selectedFormPeriod.opphørsdato,
              tom: dayjs(selectedFormPeriod.opphørsdato).add(1, 'year').subtract(1, 'day').format('YYYY-MM-DD'),
            },
            skalIkkeSendeVarsel: !!selectedFormPeriod.åpenbarGrunnTilIkkeVarsle,
            vurdering: {
              begrunnelse: selectedFormPeriod.begrunnelse,
              fraflyttingsÅrsak: selectedFormPeriod.årsak as BostedsvilkårIkkeOppfyltÅrsak,
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
        detailHeading="Ikke lenger bosatt i Trondheim"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
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
              <VStack gap="space-24" maxWidth="70ch" width="100%">
                <RhfRadioGroup
                  key={`${selectedId}-opphørsdato`}
                  control={formHook.control}
                  name={`perioder.${selectedId}.opphøreEllerAvslå`}
                  legend="Hva skal du gjøre?"
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value="opphøre">Opphøre fra en dato</Radio>
                  <Radio value="avslå">Avslå en innvilget periode</Radio>
                </RhfRadioGroup>
                {opphøreEllerAvslå === 'opphøre' && (
                  <RhfDatepicker
                    control={formHook.control}
                    name={`perioder.${selectedId}.opphørsdato`}
                    label="Opphøre fra og med"
                    readOnly={isFormLocked}
                    validate={[required]}
                  />
                )}
                <RhfSelect
                  control={formHook.control}
                  name={`perioder.${selectedId}.årsak`}
                  label="Årsak"
                  readOnly={isFormLocked}
                  validate={[required]}
                  selectValues={Object.values(BostedsvilkårIkkeOppfyltÅrsak).map(årsak => (
                    <option key={årsak} value={årsak}>
                      {opphørsårsakLabels[årsak]}
                    </option>
                  ))}
                />
                <RhfTextarea
                  control={formHook.control}
                  name={`perioder.${selectedId}.begrunnelse`}
                  label="Begrunnelse"
                  readOnly={isFormLocked}
                  validate={[required]}
                  resize
                />
                <RhfRadioGroup
                  key={`${selectedId}-varsle`}
                  control={formHook.control}
                  name={`perioder.${selectedId}.åpenbarGrunnTilIkkeVarsle`}
                  legend="Er det åpenbar grunn til å ikke varsle bruker?"
                  description="For eksempel at bruker har varslet flytting selv."
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value="ja">Ja</Radio>
                  <Radio value="nei">Nei</Radio>
                </RhfRadioGroup>
                {valgtÅrsakErAnnet && skalSendeForhåndsvarsel && (
                  <RhfTextarea
                    control={formHook.control}
                    name={`perioder.${selectedId}.forhåndsvarselTekst`}
                    label="Tekst i forhåndsvarsel (vises til bruker)"
                    description="Forklar hvorfor du har satt dato for opphør med årsak at bruker ikke lenger er bosatt i Trondheim."
                    readOnly={isFormLocked}
                    validate={[required]}
                    resize
                  />
                )}
                {åpenbarGrunnTilIkkeVarsle === 'ja' && (
                  <RhfTextarea
                    control={formHook.control}
                    name={`perioder.${selectedId}.begrunnelseForIkkeVarsle`}
                    label="Begrunnelse for hvorfor det ikke er behov for varsel"
                    readOnly={isFormLocked}
                    validate={[required]}
                    resize
                  />
                )}
                {!isFormLocked && skalSendeForhåndsvarsel && (
                  <InfoCard data-color="info" size="small">
                    <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                      <InfoCard.Title>Bruker vil få ett varsel om opphør på min side</InfoCard.Title>
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
