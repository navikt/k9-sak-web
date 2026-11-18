import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { AktivitetsvilkåretIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AktivitetsvilkåretIkkeOppfyltÅrsak.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårsavklaringVurderingerDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import {
  $VurderingAvVilkårPeriodeEtterAvklaringDto,
  type VurderingAvVilkårPeriodeEtterAvklaringDto,
} from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VurderingAvVilkårPeriodeEtterAvklaringDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { formatDate, formatPeriod } from '@k9-sak-web/gui/utils/formatters.js';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Button, HStack, InfoCard, Radio, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  getDefaultSelectedPeriodId,
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv.js';
import { sendTilBeslutter } from '../../aktivitetspenger-felles/utils/sendTilBeslutter.js';
import { aksjonspunktErÅpent } from '../../aktivitetspenger-felles/utils/utils.js';
import type { AktivitetspengerApi } from '../../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { OpphørUttalelse } from '../formfields/OpphørUttalelse.js';
import { vilkårsavklaringVurderingerQueryOptions } from '../../aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { SendTilBeslutter } from '../SendTilBeslutter.js';

const begrunnelseMaxLength = $VurderingAvVilkårPeriodeEtterAvklaringDto.properties.begrunnelse.maxLength;
const fritekstVurderingBrevMaxLength =
  $VurderingAvVilkårPeriodeEtterAvklaringDto.properties.fritekstVurderingBrev.maxLength;

// TODO: Erstatt med generert DTO når backend har lagt til VURDER_AKTIVITETSVILKÅR_OPPHØR i BekreftetAksjonspunktDto.
// Formen er antatt lik de andre *EtterAvklaringDto-ene for opphør (bosted, bistand, andre livsoppholdsytelser).
interface VurderingAvAktivitetsvilkårEtterAvklaring {
  '@type': typeof AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR;
  begrunnelse: string;
  vurdertePerioder: VurderingAvVilkårPeriodeEtterAvklaringDto[];
}

interface FormData {
  perioder: Record<
    string,
    {
      begrunnelse: string;
      ikkeIAktivitet: 'ja' | 'nei' | '';
      fritekstVurderingBrev: string;
      harFritekstbrev: boolean;
    }
  >;
}

const tilJaEllerNei = (utfall: Utfall): 'ja' | 'nei' | '' => {
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ja';
  if (utfall === Utfall.OPPFYLT) return 'nei';
  return '';
};

const buildInitialValues = (vilkårsavklaringVurderinger: VilkårsavklaringVurderingerDto): FormData => ({
  perioder: Object.fromEntries(
    vilkårsavklaringVurderinger.perioder.map(({ periode, utfall, avklaringOgVurdering }) => [
      periode.fom,
      {
        begrunnelse: avklaringOgVurdering?.vurdering?.begrunnelse ?? '',
        ikkeIAktivitet: tilJaEllerNei(utfall),
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
      const avklaring = vilkårsavklaringVurderinger.perioder.find(p => p.periode.fom === period.periode.fom)
        ?.avklaringOgVurdering?.avklaring;
      const erAvslag = avklaring?.avklaringtype === Avklaringtype.AVSLAG;
      return {
        id: period.periode.fom,
        status: getPeriodStatus(period.vilkarStatus),
        label:
          erAvslag && period.periode.tom
            ? formatPeriod(period.periode.fom, period.periode.tom)
            : formatDate(period.periode.fom),
        periode: period.periode,
        vurderesIBehandlingen: period.vurderesIBehandlingen,
        foreslåttIBehandlingen: avklaring?.foreslåttIBehandlingen,
      };
    });

interface SubmitArgs {
  formData: FormData;
  selectedId: string;
  periods: VilkårSplittPanelPeriod[];
  erÅrsakTilOpphørAnnet: boolean;
}

const buildPayload = ({
  formData,
  selectedId,
  periods,
  erÅrsakTilOpphørAnnet,
}: SubmitArgs): VurderingAvAktivitetsvilkårEtterAvklaring => {
  const selectedFormPeriod = formData.perioder[selectedId];
  if (!selectedFormPeriod) {
    throw new Error('Kunne ikke finne valgt periode for aktivitet');
  }
  const valgtPeriode = periods.find(period => period.id === selectedId);
  const erVilkårOppfylt = selectedFormPeriod.ikkeIAktivitet === 'nei';
  return {
    '@type': AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR,
    begrunnelse: selectedFormPeriod.begrunnelse,
    vurdertePerioder: [
      {
        begrunnelse: selectedFormPeriod.begrunnelse,
        erVilkårOppfylt,
        periode: {
          fom: valgtPeriode?.periode?.fom ?? '',
          tom: valgtPeriode?.periode?.tom,
        },
        fritekstVurderingBrev:
          !erVilkårOppfylt && (erÅrsakTilOpphørAnnet || selectedFormPeriod.harFritekstbrev)
            ? selectedFormPeriod.fritekstVurderingBrev
            : undefined,
      },
    ],
  };
};

interface Props {
  vurderAktivitetVilkårAP?: AksjonspunktDto;
  aktivitetVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
  lokalkontorBeslutterAP?: AksjonspunktDto;
}

export const AktivitetVilkårsvurdering = ({
  vurderAktivitetVilkårAP,
  lokalkontorForeslårVilkårAP,
  aktivitetVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
  lokalkontorBeslutterAP,
}: Props) => {
  const queryClient = useQueryClient();
  const vurderingerQueryOptions = vilkårsavklaringVurderingerQueryOptions(api, behandling, vilkarType.AKTIVITETSVILKÅR);
  const { data: vilkårsavklaringVurderinger } = useSuspenseQuery(vurderingerQueryOptions);
  const periods = buildPeriods(aktivitetVilkår, vilkårsavklaringVurderinger);
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(vilkårsavklaringVurderinger),
  });
  const [selectedId, setSelectedId] = useState(() => getDefaultSelectedPeriodId(periods));
  const valgtAvklaring = vilkårsavklaringVurderinger.perioder.find(p => p.periode.fom === selectedId)
    ?.avklaringOgVurdering?.avklaring;
  const uttalelse = valgtAvklaring?.uttalelse;
  const selectedPeriod = periods.find(p => p.id === selectedId);
  const erÅrsakTilOpphørAnnet = valgtAvklaring?.ikkeOppfyltÅrsak === AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET;
  const erAvslag = valgtAvklaring?.avklaringtype === Avklaringtype.AVSLAG;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (submitArgs: SubmitArgs) => {
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [
        // @ts-expect-error -- BekreftetAksjonspunktDto mangler DTO for VURDER_AKTIVITETSVILKÅR_OPPHØR. Fjern når backend-klienten har den.
        buildPayload(submitArgs),
      ]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vurderingerQueryOptions.queryKey });
      onAksjonspunktBekreftet();
    },
  });

  const { mutateAsync: sendTilBeslutterMutation, isPending: isSendingTilBeslutter } = useMutation({
    mutationFn: async () => sendTilBeslutter(api, behandling),
    onSuccess: onAksjonspunktBekreftet,
  });

  const isSolved = vurderAktivitetVilkårAP?.status === AksjonspunktStatus.UTFØRT;
  const erLokalkontorForeslårAPÅpent =
    !readOnly && !!lokalkontorForeslårVilkårAP && aksjonspunktErÅpent(lokalkontorForeslårVilkårAP);
  const defaultIsLocked = isSolved || erLokalkontorForeslårAPÅpent;
  const ikkeIAktivitet = useWatch({
    control: formHook.control,
    name: `perioder.${selectedId}.ikkeIAktivitet`,
  });
  const harFritekstbrev = useWatch({ control: formHook.control, name: `perioder.${selectedId}.harFritekstbrev` });

  return (
    <VStack gap="space-20">
      {!isSolved && vurderAktivitetVilkårAP && (
        <InfoCard data-color="warning" size="small">
          <InfoCard.Message icon={<ExclamationmarkTriangleFillIcon aria-hidden />}>
            Vurder om bruker ikke lenger er i aktivitet.
          </InfoCard.Message>
        </InfoCard>
      )}
      <VilkårSplittPanel
        isAktivitetspenger
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av ikke i aktivitet"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse="§ 8"
        defaultIsLocked={defaultIsLocked}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly || selectedPeriod?.vurderesIBehandlingen === false}
        afterEditButton={
          <SendTilBeslutter
            kanSendeTilBeslutter={erLokalkontorForeslårAPÅpent}
            erSendtTilBeslutter={!!lokalkontorBeslutterAP}
            isSendingTilBeslutter={isSendingTilBeslutter}
            onSendTilBeslutter={() => void sendTilBeslutterMutation()}
            api={api}
            behandling={behandling}
          />
        }
        lockedContent={isSolved ? <VurdertAv ident={vurderAktivitetVilkårAP?.ansvarligSaksbehandler} /> : undefined}
      >
        {(isFormLocked, setIsFormLocked) => (
          <RhfForm
            formMethods={formHook}
            onSubmit={async data => {
              await bekreftAksjonspunktMutation({ formData: data, selectedId, periods, erÅrsakTilOpphørAnnet });
              setIsFormLocked(true);
            }}
          >
            <VStack gap="space-24" maxWidth="70ch" width="100%">
              <OpphørUttalelse uttalelse={uttalelse} />
              <RhfTextarea
                control={formHook.control}
                name={`perioder.${selectedId}.begrunnelse`}
                label={
                  <span>
                    Vurder om bruker ikke lenger er i aktivitet, jf.{' '}
                    <Lovreferanse includeFullTextInLink isAktivitetspenger>
                      § 8 Medlemmets medvirknings- og aktivitetsplikt og konsekvenser av fravær
                    </Lovreferanse>
                  </span>
                }
                readOnly={isFormLocked}
                validate={[required, minLength(3), maxLength(begrunnelseMaxLength)]}
                resize
                maxLength={begrunnelseMaxLength}
              />
              <RhfRadioGroup
                control={formHook.control}
                legend="Skal ytelsen opphøre fordi bruker ikke er i aktivitet?"
                name={`perioder.${selectedId}.ikkeIAktivitet`}
                validate={[required]}
                readOnly={isFormLocked}
              >
                <Radio value="ja">
                  {erAvslag
                    ? `Ja, fra ${selectedPeriod?.label ?? ''}`
                    : `Ja, fra og med ${selectedPeriod?.periode?.fom ? formatDate(selectedPeriod.periode.fom) : ''}`}
                </Radio>
                <Radio value="nei">Nei</Radio>
              </RhfRadioGroup>
              {ikkeIAktivitet === 'ja' && !erÅrsakTilOpphørAnnet && (
                <RhfCheckbox
                  control={formHook.control}
                  name={`perioder.${selectedId}.harFritekstbrev`}
                  label="Legg til fritekstbeskrivelse i avslagsbrev"
                  readOnly={isFormLocked}
                />
              )}
              {ikkeIAktivitet === 'ja' && (erÅrsakTilOpphørAnnet || harFritekstbrev) && (
                <RhfTextarea
                  control={formHook.control}
                  name={`perioder.${selectedId}.fritekstVurderingBrev`}
                  label={erAvslag ? 'Fritekst avslagsbrev' : 'Fritekst opphørsbrev'}
                  description={`Forklar hvorfor vilkåret er ${erAvslag ? 'avslått' : 'opphørt'}. Teksten vises i vedtaksbrevet.`}
                  readOnly={isFormLocked}
                  validate={[required, minLength(3), maxLength(fritekstVurderingBrevMaxLength)]}
                  resize
                  maxLength={fritekstVurderingBrevMaxLength}
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
