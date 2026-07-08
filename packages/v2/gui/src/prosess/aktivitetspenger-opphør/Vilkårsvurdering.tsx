import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BostedGrunnlagResponseDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { PersonFillIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, BodyShort, Box, Button, HStack, Radio, Tag, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv.js';
import { sendTilBeslutter } from '../aktivitetspenger-felles/utils/sendTilBeslutter.js';
import { aksjonspunktErÅpent } from '../aktivitetspenger-felles/utils/utils.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { BostedsvilkårIkkeOppfyltÅrsak, opphørsårsakLabels } from '../aktivitetspenger-prosess/types.js';

interface FormData {
  perioder: Record<
    string,
    {
      årsak: string;
      begrunnelse: string;
      flyttetFraTrondheim: string;
      opphørsdato: string;
    }
  >;
}

const buildInitialValues = (bostedGrunnlag: BostedGrunnlagResponseDto): FormData => ({
  perioder: Object.fromEntries(
    (bostedGrunnlag.perioder ?? []).map(p => [
      p.fom,
      {
        årsak: p.resultat?.ikkeOppfyltÅrsak ?? '',
        begrunnelse: p.resultat?.begrunnelse ?? '',
        flyttetFraTrondheim: p.resultat?.erBosatt === false ? 'ja' : p.resultat?.erBosatt === true ? 'nei' : '',
        opphørsdato: p.fom,
      },
    ]),
  ),
});

interface Props {
  vurderBostedVilkårAP?: AksjonspunktDto;
  bostedVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
  bostedGrunnlag: BostedGrunnlagResponseDto;
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
}

export const Vilkaarsvurdering = ({
  vurderBostedVilkårAP,
  lokalkontorForeslårVilkårAP,
  bostedVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
  bostedGrunnlag,
}: Props) => {
  const periods: VilkårSplittPanelPeriod[] = (bostedVilkår.perioder ?? [])
    .toSorted((a, b) => b.periode.fom.localeCompare(a.periode.fom))
    .map(p => ({
      id: p.periode.fom,
      status: getPeriodStatus(p.vilkarStatus),
      label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}`,
      periode: p.periode,
    }));
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(bostedGrunnlag),
  });
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const selectedFakta = bostedGrunnlag.perioder.find(p => p.fom === selectedId);
  const selectedPeriod = periods.find(p => p.id === selectedId);

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const selectedFormPeriod = formData.perioder[selectedId];
      if (!selectedFormPeriod) {
        throw new Error('Kunne ikke finne valgt periode for opphør');
      }
      const valgtPeriode = periods.find(p => p.id === selectedId);
      const payload: BekreftetAksjonspunktDto = {
        '@type': AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR,
        begrunnelse: selectedFormPeriod.begrunnelse,
        vurdertePerioder: [
          {
            avslagsårsak: selectedFormPeriod.årsak as BostedsvilkårIkkeOppfyltÅrsak,
            begrunnelse: selectedFormPeriod.begrunnelse,
            erVilkårOppfylt: selectedFormPeriod.flyttetFraTrondheim === 'nei',
            periode: {
              fom: selectedFormPeriod.opphørsdato || valgtPeriode?.periode?.fom || '',
              tom: selectedFormPeriod.opphørsdato ? undefined : (valgtPeriode?.periode?.tom ?? ''),
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

  const { mutateAsync: sendTilBeslutterMutation, isPending: isSendingTilBeslutter } = useMutation({
    mutationFn: async () => sendTilBeslutter(api, behandling),
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const flyttetFraTrondheim = formHook.watch(`perioder.${selectedId}.flyttetFraTrondheim`);
  const isVurderBostedvilkårAPSolved = vurderBostedVilkårAP?.status === AksjonspunktStatus.UTFØRT;
  const erLokalkontorForeslårAPÅpent =
    !readOnly && !!lokalkontorForeslårVilkårAP && aksjonspunktErÅpent(lokalkontorForeslårVilkårAP);
  const defaultIsLocked = isVurderBostedvilkårAPSolved || erLokalkontorForeslårAPÅpent;

  return (
    <VStack gap="space-20">
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av ikke lenger bosatt i Trondheim"
        periodListLabel="Alle perioder"
        lovreferanse={bostedVilkår.lovReferanse}
        defaultIsLocked={defaultIsLocked}
        readOnly={selectedPeriod?.status === 'success' || readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        afterEditButton={
          erLokalkontorForeslårAPÅpent ? (
            <VStack gap="space-20">
              <Alert variant="success" size="small">
                Alle inngangsvilkår for Nav-kontor er ferdig vurdert.
              </Alert>
              <Box>
                <Button
                  variant="primary"
                  data-color="accent"
                  size="small"
                  type="button"
                  loading={isSendingTilBeslutter}
                  onClick={() => void sendTilBeslutterMutation()}
                >
                  Send til beslutter
                </Button>
              </Box>
            </VStack>
          ) : null
        }
        lockedContent={
          isVurderBostedvilkårAPSolved ? <VurdertAv ident={vurderBostedVilkårAP?.ansvarligSaksbehandler} /> : undefined
        }
      >
        {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => (
          <RhfForm
            formMethods={formHook}
            onSubmit={async data => {
              await bekreftAksjonspunktMutation(data);
              setIsFormLocked(true);
            }}
          >
            <VStack gap="space-24" maxWidth="70ch" width="100%">
              {selectedFakta?.harUttalelse && (
                <Box borderRadius="8" padding="space-16" background="info-softA">
                  <VStack gap="space-20">
                    <VStack gap="space-8">
                      <HStack justify="space-between">
                        <BodyShort size="small" weight="semibold">
                          Stemmer opplysningene om opphør?
                        </BodyShort>
                        <Tag variant="outline" data-color="info" size="small">
                          Fra bruker
                        </Tag>
                      </HStack>
                      <BodyShort size="small">Nei</BodyShort>
                    </VStack>
                    <HStack gap="space-4">
                      <PersonFillIcon title="Bruker" fontSize="1.5rem" />
                      <VStack gap="space-6" marginBlock="space-2 space-0">
                        <BodyShort size="small" weight="semibold">
                          Tilbakemelding fra bruker om opphør xx.xx.xxxx
                        </BodyShort>
                        <BodyLong size="small">{selectedFakta.uttalelseTekst}</BodyLong>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              )}
              <RhfSelect
                control={formHook.control}
                name={`perioder.${selectedId}.årsak`}
                label="Opphørsårsak"
                readOnly={isFormLocked}
                validate={[required]}
                selectValues={Object.values(BostedsvilkårIkkeOppfyltÅrsak)
                  .filter(årsak => årsak !== '-')
                  .map(årsak => (
                    <option key={årsak} value={årsak}>
                      {opphørsårsakLabels[årsak]}
                    </option>
                  ))}
              />
              <RhfTextarea
                control={formHook.control}
                name={`perioder.${selectedId}.begrunnelse`}
                label="Vurder om bruker har flyttet fra Trondheim kommune, jmf"
                readOnly={isFormLocked}
                validate={[required, minLength(3), maxLength(4000)]}
                resize
              />
              <RhfRadioGroup
                control={formHook.control}
                legend="Har bruker flyttet fra Trondheim kommune?"
                name={`perioder.${selectedId}.flyttetFraTrondheim`}
                validate={[required]}
                readOnly={isFormLocked}
              >
                <Radio value="ja">
                  Ja, fra og med {selectedPeriod?.periode?.fom ? formatDate(selectedPeriod?.periode?.fom) : ''}
                </Radio>
                <Radio value="jaMedAnnenDato">Ja, fra en annen dato</Radio>
                <Radio value="nei">Nei, bruker bor fortsatt i Trondheim</Radio>
              </RhfRadioGroup>
              {flyttetFraTrondheim === 'jaMedAnnenDato' && (
                <RhfDatepicker
                  control={formHook.control}
                  name={`perioder.${selectedId}.opphørsdato`}
                  label="Dato for opphør"
                  readOnly={isFormLocked}
                  validate={[required]}
                  fromDate={selectedPeriod?.periode?.fom ? new Date(selectedPeriod?.periode?.fom) : undefined}
                  toDate={selectedPeriod?.periode?.tom ? new Date(selectedPeriod?.periode?.tom) : undefined}
                  defaultMonth={selectedPeriod?.periode?.fom ? new Date(selectedPeriod.periode.fom) : undefined}
                />
              )}
              {!isFormLocked && (
                <HStack gap="space-16">
                  <Button type="submit" size="small" loading={isPending}>
                    Send til beslutter
                  </Button>
                  {defaultIsLocked && (
                    <Button type="button" size="small" variant="secondary" onClick={() => setIsFormLocked(true)}>
                      Avbryt
                    </Button>
                  )}
                </HStack>
              )}
            </VStack>
          </RhfForm>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
