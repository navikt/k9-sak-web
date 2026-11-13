import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/Avklaringtype.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårsavklaringVurderingerDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { formatDate, formatPeriod } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, Button, HStack, Radio, VStack } from '@navikt/ds-react';
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

interface PeriodForm {
  begrunnelse: string;
  andreLivsoppholdytelser: 'ja' | 'nei' | '';
  fritekstVurderingBrev: string;
  harFritekstbrev: boolean;
}

interface FormData {
  perioder: Record<string, PeriodForm>;
}

interface Props {
  vurderAndreLivsoppholdytelserVilkårAP?: AksjonspunktDto;
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
  lokalkontorBeslutterAP?: AksjonspunktDto;
}

const buildInitialValues = (vilkårsavklaringVurderinger: VilkårsavklaringVurderingerDto): FormData => ({
  perioder: Object.fromEntries(
    (vilkårsavklaringVurderinger.perioder ?? []).map(period => [
      `${period.periode.fom}_${period.periode.tom ?? 'åpen_periode'}`,
      {
        begrunnelse: period.avklaringOgVurdering?.vurdering?.begrunnelse ?? '',
        andreLivsoppholdytelser:
          period.utfall === Utfall.OPPFYLT ? 'nei' : period.utfall === Utfall.IKKE_OPPFYLT ? 'ja' : '',
        fritekstVurderingBrev: period.avklaringOgVurdering?.vurdering?.fritekstVurderingBrev ?? '',
        harFritekstbrev: !!period.avklaringOgVurdering?.vurdering?.fritekstVurderingBrev,
      },
    ]),
  ),
});

const buildPeriods = (vilkårsavklaringVurderinger: VilkårsavklaringVurderingerDto): VilkårSplittPanelPeriod[] =>
  (vilkårsavklaringVurderinger.perioder ?? [])
    .toSorted((firstPeriod, secondPeriod) => secondPeriod.periode.fom.localeCompare(firstPeriod.periode.fom))
    .map(period => {
      const erAvslag = period.avklaringOgVurdering?.avklaring?.avklaringtype === Avklaringtype.AVSLAG;
      return {
        id: `${period.periode.fom}_${period.periode.tom ?? 'åpen_periode'}`,
        status: getPeriodStatus(period.utfall),
        label:
          erAvslag && period.periode.tom
            ? formatPeriod(period.periode.fom, period.periode.tom)
            : formatDate(period.periode.fom),
        periode: period.periode,
        foreslåttIBehandlingen: period.avklaringOgVurdering?.avklaring?.foreslåttIBehandlingen,
      };
    });

const buildPayload = ({
  formData,
  selectedId,
  periods,
}: {
  formData: FormData;
  selectedId: string;
  periods: VilkårSplittPanelPeriod[];
}) => {
  const selectedFormPeriod = formData.perioder[selectedId];
  if (!selectedFormPeriod) {
    throw new Error('Kunne ikke finne valgt periode for andre livsoppholdsytelser');
  }
  const erVilkårOppfylt = selectedFormPeriod.andreLivsoppholdytelser === 'nei';
  const selectedPeriod = periods.find(p => p.id === selectedId);
  return {
    '@type': AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER_OPPHØR,
    begrunnelse: selectedFormPeriod.begrunnelse,
    vurdertePerioder: [
      {
        begrunnelse: selectedFormPeriod.begrunnelse,
        erVilkårOppfylt,
        periode: { fom: selectedPeriod?.periode?.fom ?? '', tom: selectedPeriod?.periode?.tom },
        fritekstVurderingBrev:
          !erVilkårOppfylt && selectedFormPeriod.harFritekstbrev ? selectedFormPeriod.fritekstVurderingBrev : undefined,
      },
    ],
  };
};

export const AndreLivsoppholdytelserVilkårsvurdering = ({
  vurderAndreLivsoppholdytelserVilkårAP,
  lokalkontorForeslårVilkårAP,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
  lokalkontorBeslutterAP,
}: Props) => {
  const queryClient = useQueryClient();
  const vurderingerQueryOptions = vilkårsavklaringVurderingerQueryOptions(
    api,
    behandling,
    vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  );
  const { data: vilkårsavklaringVurderinger } = useSuspenseQuery(vurderingerQueryOptions);
  const periods = buildPeriods(vilkårsavklaringVurderinger);
  const [selectedId, setSelectedId] = useState(() => getDefaultSelectedPeriodId(periods));
  const formHook = useForm<FormData>({ defaultValues: buildInitialValues(vilkårsavklaringVurderinger) });
  const andreLivsoppholdytelser = useWatch({
    control: formHook.control,
    name: `perioder.${selectedId}.andreLivsoppholdytelser`,
  });
  const harFritekstbrev = formHook.watch(`perioder.${selectedId}.harFritekstbrev`);
  const isSolved = vurderAndreLivsoppholdytelserVilkårAP?.status === AksjonspunktStatus.UTFØRT;
  const erLokalkontorForeslårAPÅpent =
    !readOnly && !!lokalkontorForeslårVilkårAP && aksjonspunktErÅpent(lokalkontorForeslårVilkårAP);
  const defaultIsLocked = isSolved || erLokalkontorForeslårAPÅpent;
  const selectedPeriod = periods.find(period => period.id === selectedId);
  const selectedVilkårsavklaringVurdering = vilkårsavklaringVurderinger.perioder.find(
    vurdering =>
      vurdering.periode?.fom === selectedPeriod?.periode?.fom &&
      vurdering.periode?.tom === selectedPeriod?.periode?.tom,
  );
  const erAvslag =
    selectedVilkårsavklaringVurdering?.avklaringOgVurdering?.avklaring?.avklaringtype === Avklaringtype.AVSLAG;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [
        buildPayload({ formData, selectedId, periods }),
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
  const uttalelse = selectedVilkårsavklaringVurdering?.avklaringOgVurdering?.avklaring.uttalelse;

  return (
    <VStack gap="space-20">
      {!isSolved && vurderAndreLivsoppholdytelserVilkårAP && (
        <Alert variant="warning" size="small">
          Vurder om søker mottar andre livsoppholdsytelser.
        </Alert>
      )}
      <VilkårSplittPanel
        isAktivitetspenger
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av andre livsoppholdsytelser"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse="§ 4"
        defaultIsLocked={isSolved || erLokalkontorForeslårAPÅpent}
        readOnly={readOnly || selectedPeriod?.status === 'success' || selectedPeriod?.status === 'error'}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        lockedContent={
          isSolved ? <VurdertAv ident={vurderAndreLivsoppholdytelserVilkårAP?.ansvarligSaksbehandler} /> : undefined
        }
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
      >
        {(isFormLocked, setIsFormLocked) => (
          <RhfForm
            formMethods={formHook}
            onSubmit={async data => {
              await bekreftAksjonspunktMutation(data);
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
                    Vurder om bruker mottar annen livoppholdsytelse, jf.{' '}
                    <Lovreferanse includeFullTextInLink isAktivitetspenger>
                      § 4 Forholdet til andre ytelser
                    </Lovreferanse>
                  </span>
                }
                readOnly={isFormLocked}
                validate={[required, minLength(3), maxLength(4000)]}
                resize
                maxLength={4000}
              />
              <RhfRadioGroup
                control={formHook.control}
                name={`perioder.${selectedId}.andreLivsoppholdytelser`}
                legend="Mottar bruker annen livsoppholdsytelse?"
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
              {andreLivsoppholdytelser === 'ja' && (
                <RhfCheckbox
                  control={formHook.control}
                  name={`perioder.${selectedId}.harFritekstbrev`}
                  label="Legg til fritekstbeskrivelse i avslagsbrev"
                  readOnly={isFormLocked}
                />
              )}
              {andreLivsoppholdytelser === 'ja' && harFritekstbrev && (
                <RhfTextarea
                  control={formHook.control}
                  name={`perioder.${selectedId}.fritekstVurderingBrev`}
                  label={erAvslag ? 'Fritekst avslagsbrev' : 'Fritekst opphørsbrev'}
                  description={`Forklar hvorfor vilkåret er ${erAvslag ? 'avslått' : 'opphørt'}. Teksten vises i vedtaksbrevet.`}
                  readOnly={isFormLocked}
                  validate={[required, minLength(3), maxLength(4000)]} // TODO
                  resize
                  maxLength={4000} // TODO
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
