import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/Avklaringtype.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import {
  $ManuellVurderingBostedsvilkårDto,
  $VilkårBostedPeriodeVurderingDto,
} from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårsavklaringVurderingerDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { formatDate, formatPeriod } from '@k9-sak-web/gui/utils/formatters.js';
import { PersonFillIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, BodyShort, Box, Button, HStack, Radio, Tag, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv.js';
import { ForhåndsvisVedtaksbrev } from '../../aktivitetspenger-felles/ForhåndsvisVedtaksbrev.js';
import { sendTilBeslutter } from '../../aktivitetspenger-felles/utils/sendTilBeslutter.js';
import { aksjonspunktErÅpent } from '../../aktivitetspenger-felles/utils/utils.js';
import type { AktivitetspengerApi } from '../../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { vilkårsavklaringVurderingerQueryOptions } from '../../aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '../../aktivitetspenger-prosess/types.js';

interface FormData {
  perioder: Record<
    string,
    {
      begrunnelse: string;
      flyttetFraTrondheim: string;
      fritekstVurderingBrev: string;
      harFritekstbrev: boolean;
    }
  >;
}

const buildInitialValues = (vilkårsavklaringVurderinger: VilkårsavklaringVurderingerDto): FormData => ({
  perioder: Object.fromEntries(
    vilkårsavklaringVurderinger.perioder.map(({ periode, utfall, avklaringOgVurdering }) => [
      periode.fom,
      {
        begrunnelse: avklaringOgVurdering?.vurdering?.begrunnelse ?? '',
        flyttetFraTrondheim: utfall === Utfall.IKKE_OPPFYLT ? 'ja' : utfall === Utfall.OPPFYLT ? 'nei' : '',
        fritekstVurderingBrev: avklaringOgVurdering?.vurdering?.fritekstVurderingBrev ?? '',
        harFritekstbrev: !!avklaringOgVurdering?.vurdering?.fritekstVurderingBrev,
      },
    ]),
  ),
});

const buildPeriods = (
  vilkår: VilkårMedPerioderDto,
  vilkårsavklaringVurderinger: VilkårsavklaringVurderingerDto,
): VilkårSplittPanelPeriod[] =>
  (vilkår.perioder ?? [])
    .toSorted((firstPeriod, secondPeriod) => secondPeriod.periode.fom.localeCompare(firstPeriod.periode.fom))
    .map(period => {
      const erAvslag =
        vilkårsavklaringVurderinger.perioder.find(p => p.periode.fom === period.periode.fom)?.avklaringOgVurdering
          ?.avklaring?.avklaringtype === Avklaringtype.AVSLAG;
      return {
        id: period.periode.fom,
        status: getPeriodStatus(period.vilkarStatus),
        label:
          erAvslag && period.periode.tom
            ? formatPeriod(period.periode.fom, period.periode.tom)
            : formatDate(period.periode.fom),
        periode: period.periode,
        vurderesIBehandlingen: period.vurderesIBehandlingen,
      };
    });

const buildPayload = ({
  formData,
  selectedId,
  periods,
  erÅrsakTilOpphørAnnet,
}: {
  formData: FormData;
  selectedId: string;
  periods: VilkårSplittPanelPeriod[];
  erÅrsakTilOpphørAnnet: boolean;
}): BekreftetAksjonspunktDto => {
  const selectedFormPeriod = formData.perioder[selectedId];
  if (!selectedFormPeriod) {
    throw new Error('Kunne ikke finne valgt periode for opphør');
  }
  const valgtPeriode = periods.find(period => period.id === selectedId);
  return {
    '@type': AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR,
    begrunnelse: selectedFormPeriod.begrunnelse,
    vurdertePerioder: [
      {
        begrunnelse: selectedFormPeriod.begrunnelse,
        erVilkårOppfylt: selectedFormPeriod.flyttetFraTrondheim === 'nei',
        periode: {
          fom: valgtPeriode?.periode?.fom ?? '',
          tom: valgtPeriode?.periode?.tom,
        },
        fritekstVurderingBrev:
          selectedFormPeriod.flyttetFraTrondheim === 'ja' &&
          (erÅrsakTilOpphørAnnet || selectedFormPeriod.harFritekstbrev)
            ? selectedFormPeriod.fritekstVurderingBrev
            : undefined,
      },
    ],
  };
};

interface Props {
  vurderBostedVilkårAP?: AksjonspunktDto;
  bostedVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
  lokalkontorBeslutterAP?: AksjonspunktDto;
}

interface SendTilBeslutterProps {
  kanSendeTilBeslutter: boolean;
  visForBeslutter: boolean;
  isSendingTilBeslutter: boolean;
  onSendTilBeslutter: () => void;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
}

const SendTilBeslutter = ({
  kanSendeTilBeslutter,
  visForBeslutter,
  isSendingTilBeslutter,
  onSendTilBeslutter,
  api,
  behandling,
}: SendTilBeslutterProps) => {
  if (kanSendeTilBeslutter) {
    return (
      <VStack gap="space-20">
        <Alert variant="success" size="small">
          Alle inngangsvilkår for Nav-kontor er ferdig vurdert.
        </Alert>
        <HStack gap="space-8" align="start">
          <Button
            variant="primary"
            data-color="accent"
            size="small"
            type="button"
            loading={isSendingTilBeslutter}
            onClick={onSendTilBeslutter}
          >
            Send til beslutter
          </Button>
          <ForhåndsvisVedtaksbrev api={api} behandling={behandling} />
        </HStack>
      </VStack>
    );
  }

  if (visForBeslutter) {
    return <ForhåndsvisVedtaksbrev api={api} behandling={behandling} />;
  }

  return null;
};

export const BostedVilkårsvurdering = ({
  vurderBostedVilkårAP,
  lokalkontorForeslårVilkårAP,
  bostedVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
  lokalkontorBeslutterAP,
}: Props) => {
  const queryClient = useQueryClient();
  const vurderingerQueryOptions = vilkårsavklaringVurderingerQueryOptions(api, behandling, vilkarType.BOSTEDSVILKÅR);
  const { data: vilkårsavklaringVurderinger } = useSuspenseQuery(vurderingerQueryOptions);
  const periods = buildPeriods(bostedVilkår, vilkårsavklaringVurderinger);
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(vilkårsavklaringVurderinger),
  });
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const valgtAvklaring = vilkårsavklaringVurderinger.perioder.find(p => p.periode.fom === selectedId)
    ?.avklaringOgVurdering?.avklaring;
  const uttalelse = valgtAvklaring?.uttalelse;
  const selectedPeriod = periods.find(p => p.id === selectedId);
  const erÅrsakTilOpphørAnnet = valgtAvklaring?.ikkeOppfyltÅrsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = buildPayload({ formData, selectedId, periods, erÅrsakTilOpphørAnnet });
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vurderingerQueryOptions.queryKey });
      onAksjonspunktBekreftet();
    },
  });

  const { mutateAsync: sendTilBeslutterMutation, isPending: isSendingTilBeslutter } = useMutation({
    mutationFn: async () => sendTilBeslutter(api, behandling),
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const isVurderBostedvilkårAPSolved = vurderBostedVilkårAP?.status === AksjonspunktStatus.UTFØRT;
  const erLokalkontorForeslårAPÅpent =
    !readOnly && !!lokalkontorForeslårVilkårAP && aksjonspunktErÅpent(lokalkontorForeslårVilkårAP);
  const defaultIsLocked = isVurderBostedvilkårAPSolved || erLokalkontorForeslårAPÅpent;
  const flyttetFraTrondheim = useWatch({
    control: formHook.control,
    name: `perioder.${selectedId}.flyttetFraTrondheim`,
  });
  const harFritekstbrev = formHook.watch(`perioder.${selectedId}.harFritekstbrev`);

  return (
    <VStack gap="space-20">
      {!isVurderBostedvilkårAPSolved && vurderBostedVilkårAP && (
        <Alert variant="warning" size="small">
          Vurder om søker ikke lenger er bosatt i Trondheim kommune.
        </Alert>
      )}
      <VilkårSplittPanel
        isAktivitetspenger
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av ikke lenger bosatt i Trondheim kommune"
        periodListLabel="Alle perioder"
        lovreferanse="§ 2"
        defaultIsLocked={defaultIsLocked}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly || selectedPeriod?.vurderesIBehandlingen === false}
        afterEditButton={
          <SendTilBeslutter
            kanSendeTilBeslutter={erLokalkontorForeslårAPÅpent}
            visForBeslutter={!!lokalkontorBeslutterAP}
            isSendingTilBeslutter={isSendingTilBeslutter}
            onSendTilBeslutter={() => void sendTilBeslutterMutation()}
            api={api}
            behandling={behandling}
          />
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
              {uttalelse?.harUttalelse && (
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
                        <BodyLong size="small">{uttalelse.uttalelseTekst}</BodyLong>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              )}
              <RhfTextarea
                control={formHook.control}
                name={`perioder.${selectedId}.begrunnelse`}
                label={
                  <span>
                    Vurder om bruker har flyttet fra Trondheim kommune, jmf{' '}
                    <Lovreferanse includeFullTextInLink isAktivitetspenger>
                      §2 Geografisk virkeområde
                    </Lovreferanse>
                  </span>
                }
                readOnly={isFormLocked}
                validate={[
                  required,
                  minLength(3),
                  maxLength($ManuellVurderingBostedsvilkårDto.properties.begrunnelse.maxLength),
                ]}
                resize
                maxLength={$ManuellVurderingBostedsvilkårDto.properties.begrunnelse.maxLength}
              />
              <RhfRadioGroup
                control={formHook.control}
                legend="Har bruker flyttet fra Trondheim kommune?"
                name={`perioder.${selectedId}.flyttetFraTrondheim`}
                validate={[required]}
                readOnly={isFormLocked}
              >
                <Radio value="ja">
                  {valgtAvklaring?.avklaringtype === Avklaringtype.AVSLAG
                    ? `Ja, fra ${selectedPeriod?.label ?? ''}`
                    : `Ja, fra og med ${selectedPeriod?.periode?.fom ? formatDate(selectedPeriod.periode.fom) : ''}`}
                </Radio>
                <Radio value="nei">Nei, bruker bor fortsatt i Trondheim kommune</Radio>
              </RhfRadioGroup>
              {flyttetFraTrondheim === 'ja' && !erÅrsakTilOpphørAnnet && (
                <RhfCheckbox
                  control={formHook.control}
                  name={`perioder.${selectedId}.harFritekstbrev`}
                  label="Legg til fritekstbeskrivelse i avslagsbrev"
                  readOnly={isFormLocked}
                />
              )}
              {flyttetFraTrondheim === 'ja' && (erÅrsakTilOpphørAnnet || harFritekstbrev) && (
                <RhfTextarea
                  control={formHook.control}
                  name={`perioder.${selectedId}.fritekstVurderingBrev`}
                  label="Fritekst opphørsbrev"
                  description="Forklar hvorfor vilkåret er opphørt. Teksten vises i vedtaksbrevet."
                  readOnly={isFormLocked}
                  validate={[
                    required,
                    minLength(3),
                    maxLength($VilkårBostedPeriodeVurderingDto.properties.fritekstVurderingBrev.maxLength),
                  ]}
                  resize
                  maxLength={$VilkårBostedPeriodeVurderingDto.properties.fritekstVurderingBrev.maxLength}
                />
              )}
              {!isFormLocked && (
                <HStack gap="space-16">
                  <Button type="submit" size="small" loading={isPending}>
                    Bekreft og fortsett
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
