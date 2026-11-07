import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårsavklaringVurderingerDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import { $VurderingAvAndreLivsoppholdsytelserEtterAvklaringDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/livsopphold/VurderingAvAndreLivsoppholdsytelserEtterAvklaringDto.js';
import { $VurderingAvVilkårPeriodeEtterAvklaringDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VurderingAvVilkårPeriodeEtterAvklaringDto.js';
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

const begrunnelseMaxLength = $VurderingAvAndreLivsoppholdsytelserEtterAvklaringDto.properties.begrunnelse.maxLength;
const fritekstVurderingBrevMaxLength =
  $VurderingAvVilkårPeriodeEtterAvklaringDto.properties.fritekstVurderingBrev.maxLength;

interface FormData {
  perioder: Record<
    string,
    {
      begrunnelse: string;
      andreLivsoppholdytelser: 'ja' | 'nei' | '';
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
        andreLivsoppholdytelser: tilJaEllerNei(utfall),
        fritekstVurderingBrev: avklaringOgVurdering?.vurdering?.fritekstVurderingBrev ?? '',
        harFritekstbrev: !!avklaringOgVurdering?.vurdering?.fritekstVurderingBrev,
      },
    ]),
  ),
});

const buildPeriods = (vilkårsavklaringVurderinger: VilkårsavklaringVurderingerDto): VilkårSplittPanelPeriod[] =>
  vilkårsavklaringVurderinger.perioder
    .toSorted((firstPeriod, secondPeriod) => secondPeriod.periode.fom.localeCompare(firstPeriod.periode.fom))
    .map(({ periode, utfall, vurderesIBehandlingen, avklaringOgVurdering }) => {
      const avklaring = avklaringOgVurdering?.avklaring;
      const erAvslag = avklaring?.avklaringtype === Avklaringtype.AVSLAG;
      return {
        id: periode.fom,
        status: getPeriodStatus(utfall),
        label: erAvslag && periode.tom ? formatPeriod(periode.fom, periode.tom) : formatDate(periode.fom),
        periode,
        vurderesIBehandlingen,
        foreslåttIBehandlingen: avklaring?.foreslåttIBehandlingen,
      };
    });

interface SubmitArgs {
  formData: FormData;
  selectedId: string;
  periods: VilkårSplittPanelPeriod[];
}

const buildPayload = ({ formData, selectedId, periods }: SubmitArgs): BekreftetAksjonspunktDto => {
  const selectedFormPeriod = formData.perioder[selectedId];
  if (!selectedFormPeriod) {
    throw new Error('Kunne ikke finne valgt periode for andre livsoppholdsytelser');
  }
  const valgtPeriode = periods.find(period => period.id === selectedId);
  const erVilkårOppfylt = selectedFormPeriod.andreLivsoppholdytelser === 'nei';
  return {
    '@type': AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER_OPPHØR,
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
          !erVilkårOppfylt && selectedFormPeriod.harFritekstbrev ? selectedFormPeriod.fritekstVurderingBrev : undefined,
      },
    ],
  };
};

interface Props {
  vurderAndreLivsoppholdytelserVilkårAP?: AksjonspunktDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
  lokalkontorBeslutterAP?: AksjonspunktDto;
}

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
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(vilkårsavklaringVurderinger),
  });
  const [selectedId, setSelectedId] = useState(() => getDefaultSelectedPeriodId(periods));
  const valgtAvklaring = vilkårsavklaringVurderinger.perioder.find(p => p.periode.fom === selectedId)
    ?.avklaringOgVurdering?.avklaring;
  const uttalelse = valgtAvklaring?.uttalelse;
  const selectedPeriod = periods.find(p => p.id === selectedId);
  const erAvslag = valgtAvklaring?.avklaringtype === Avklaringtype.AVSLAG;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (submitArgs: SubmitArgs) => {
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [buildPayload(submitArgs)]);
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

  const isSolved = vurderAndreLivsoppholdytelserVilkårAP?.status === AksjonspunktStatus.UTFØRT;
  const erLokalkontorForeslårAPÅpent =
    !readOnly && !!lokalkontorForeslårVilkårAP && aksjonspunktErÅpent(lokalkontorForeslårVilkårAP);
  const defaultIsLocked = isSolved || erLokalkontorForeslårAPÅpent;
  const andreLivsoppholdytelser = useWatch({
    control: formHook.control,
    name: `perioder.${selectedId}.andreLivsoppholdytelser`,
  });
  const harFritekstbrev = useWatch({ control: formHook.control, name: `perioder.${selectedId}.harFritekstbrev` });

  return (
    <VStack gap="space-20">
      {!isSolved && vurderAndreLivsoppholdytelserVilkårAP && (
        <InfoCard data-color="warning" size="small">
          <InfoCard.Message
            icon={<ExclamationmarkTriangleFillIcon aria-hidden color="var(--ax-text-warning-decoration)" />}
          >
            Vurder om søker mottar andre livsoppholdsytelser.
          </InfoCard.Message>
        </InfoCard>
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
        lockedContent={
          isSolved ? <VurdertAv ident={vurderAndreLivsoppholdytelserVilkårAP?.ansvarligSaksbehandler} /> : undefined
        }
      >
        {(isFormLocked, setIsFormLocked) => (
          <RhfForm
            formMethods={formHook}
            onSubmit={async data => {
              await bekreftAksjonspunktMutation({ formData: data, selectedId, periods });
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
                validate={[required, minLength(3), maxLength(begrunnelseMaxLength)]}
                resize
                maxLength={begrunnelseMaxLength}
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
