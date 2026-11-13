import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { VilkårType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårsavklaringVurderingerDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import { $VurderingAvVilkårPeriodeEtterAvklaringDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VurderingAvVilkårPeriodeEtterAvklaringDto.js';
import { formatDate, formatPeriod } from '@k9-sak-web/gui/utils/formatters.js';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Button, HStack, InfoCard, Radio, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  getDefaultSelectedPeriodId,
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv.js';
import { sendTilBeslutter } from '../aktivitetspenger-felles/utils/sendTilBeslutter.js';
import { aksjonspunktErÅpent } from '../aktivitetspenger-felles/utils/utils.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { vilkårsavklaringVurderingerQueryOptions } from '../aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { OpphørUttalelse } from './formfields/OpphørUttalelse.js';
import { SendTilBeslutter } from './SendTilBeslutter.js';

const fritekstVurderingBrevMaxLength =
  $VurderingAvVilkårPeriodeEtterAvklaringDto.properties.fritekstVurderingBrev.maxLength;

type OpphørAksjonspunktKode =
  | typeof AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR
  | typeof AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR_OPPHØR
  | typeof AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER_OPPHØR
  | typeof AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR;

type VurderingEtterAvklaring = Extract<BekreftetAksjonspunktDto, { '@type': OpphørAksjonspunktKode }>;

export interface OpphørVilkårsvurderingOppsett {
  vilkårType: VilkårType;
  aksjonspunktKode: OpphørAksjonspunktKode;
  årsakSomKreverFritekstIBrev?: string;
  begrunnelseMaxLength: number;
  tekster: {
    varsel: string;
    overskrift: string;
    lovreferanse: string;
    begrunnelseLedetekst: ReactNode;
    spørsmål: string;
    nei: string;
  };
}

interface FormData {
  perioder: Record<
    string,
    {
      begrunnelse: string;
      skalOpphøre: 'ja' | 'nei' | '';
      fritekstVurderingBrev: string;
      harFritekstbrev: boolean;
      erBrukerInformert: 'ja' | 'nei' | '';
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
        skalOpphøre: tilJaEllerNei(utfall),
        fritekstVurderingBrev: avklaringOgVurdering?.vurdering?.fritekstVurderingBrev ?? '',
        harFritekstbrev: !!avklaringOgVurdering?.vurdering?.fritekstVurderingBrev,
        erBrukerInformert: '',
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
  kreverFritekstIBrev: boolean;
  aksjonspunktKode: OpphørAksjonspunktKode;
}

const buildPayload = ({
  formData,
  selectedId,
  periods,
  kreverFritekstIBrev,
  aksjonspunktKode,
}: SubmitArgs): VurderingEtterAvklaring => {
  const selectedFormPeriod = formData.perioder[selectedId];
  if (!selectedFormPeriod) {
    throw new Error('Kunne ikke finne valgt periode for opphør');
  }
  const valgtPeriode = periods.find(period => period.id === selectedId);
  const erVilkårOppfylt = selectedFormPeriod.skalOpphøre === 'nei';
  return {
    '@type': aksjonspunktKode,
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
          !erVilkårOppfylt && (kreverFritekstIBrev || selectedFormPeriod.harFritekstbrev)
            ? selectedFormPeriod.fritekstVurderingBrev
            : undefined,
      },
    ],
  };
};

interface Props {
  oppsett: OpphørVilkårsvurderingOppsett;
  vurderVilkårAP?: AksjonspunktDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
  lokalkontorBeslutterAP?: AksjonspunktDto;
}

export const OpphørVilkårsvurdering = ({
  oppsett,
  vurderVilkårAP,
  lokalkontorForeslårVilkårAP,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
  lokalkontorBeslutterAP,
}: Props) => {
  const { vilkårType, aksjonspunktKode, årsakSomKreverFritekstIBrev, begrunnelseMaxLength, tekster } = oppsett;
  const queryClient = useQueryClient();
  const vurderingerQueryOptions = vilkårsavklaringVurderingerQueryOptions(api, behandling, vilkårType);
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
  const kreverFritekstIBrev =
    årsakSomKreverFritekstIBrev !== undefined && valgtAvklaring?.ikkeOppfyltÅrsak === årsakSomKreverFritekstIBrev;
  const erAvslag = valgtAvklaring?.avklaringtype === Avklaringtype.AVSLAG;
  const harSendtVarsel = valgtAvklaring?.skalSendeVarsel === true;
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

  const isSolved = vurderVilkårAP?.status === AksjonspunktStatus.UTFØRT;
  const erLokalkontorForeslårAPÅpent =
    !readOnly && !!lokalkontorForeslårVilkårAP && aksjonspunktErÅpent(lokalkontorForeslårVilkårAP);
  const defaultIsLocked = isSolved || erLokalkontorForeslårAPÅpent;
  const skalOpphøre = useWatch({ control: formHook.control, name: `perioder.${selectedId}.skalOpphøre` });
  const harFritekstbrev = useWatch({ control: formHook.control, name: `perioder.${selectedId}.harFritekstbrev` });

  return (
    <VStack gap="space-20">
      {!isSolved && vurderVilkårAP && (
        <InfoCard data-color="warning" size="small">
          <InfoCard.Message
            icon={<ExclamationmarkTriangleFillIcon aria-hidden color="var(--ax-text-warning-decoration)" />}
          >
            {tekster.varsel}
          </InfoCard.Message>
        </InfoCard>
      )}
      <VilkårSplittPanel
        isAktivitetspenger
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading={tekster.overskrift}
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse={tekster.lovreferanse}
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
        lockedContent={isSolved ? <VurdertAv ident={vurderVilkårAP?.ansvarligSaksbehandler} /> : undefined}
      >
        {(isFormLocked, setIsFormLocked) => (
          <RhfForm
            formMethods={formHook}
            onSubmit={async data => {
              await bekreftAksjonspunktMutation({
                formData: data,
                selectedId,
                periods,
                kreverFritekstIBrev,
                aksjonspunktKode,
              });
              setIsFormLocked(true);
            }}
          >
            <VStack gap="space-24" maxWidth="70ch" width="100%">
              <OpphørUttalelse uttalelse={uttalelse} />
              <RhfTextarea
                control={formHook.control}
                name={`perioder.${selectedId}.begrunnelse`}
                label={<span>{tekster.begrunnelseLedetekst}</span>}
                readOnly={isFormLocked || isPending}
                validate={[required, minLength(3), maxLength(begrunnelseMaxLength)]}
                resize
                maxLength={begrunnelseMaxLength}
              />
              <RhfRadioGroup
                control={formHook.control}
                legend={tekster.spørsmål}
                name={`perioder.${selectedId}.skalOpphøre`}
                validate={[required]}
                readOnly={isFormLocked || isPending}
              >
                <Radio value="ja">
                  {erAvslag
                    ? `Ja, fra ${selectedPeriod?.label ?? ''}`
                    : `Ja, fra og med ${selectedPeriod?.periode?.fom ? formatDate(selectedPeriod.periode.fom) : ''}`}
                </Radio>
                <Radio value="nei">{tekster.nei}</Radio>
              </RhfRadioGroup>
              {skalOpphøre === 'ja' && !kreverFritekstIBrev && (
                <RhfCheckbox
                  control={formHook.control}
                  name={`perioder.${selectedId}.harFritekstbrev`}
                  label="Legg til fritekstbeskrivelse i avslagsbrev"
                  readOnly={isFormLocked || isPending}
                />
              )}
              {skalOpphøre === 'ja' && (kreverFritekstIBrev || harFritekstbrev) && (
                <RhfTextarea
                  control={formHook.control}
                  name={`perioder.${selectedId}.fritekstVurderingBrev`}
                  label={erAvslag ? 'Fritekst avslagsbrev' : 'Fritekst opphørsbrev'}
                  description={`Forklar hvorfor vilkåret er ${erAvslag ? 'avslått' : 'opphørt'}. Teksten vises i vedtaksbrevet.`}
                  readOnly={isFormLocked || isPending}
                  validate={[required, minLength(3), maxLength(fritekstVurderingBrevMaxLength)]}
                  resize
                  maxLength={fritekstVurderingBrevMaxLength}
                />
              )}
              {skalOpphøre === 'nei' && harSendtVarsel === false && (
                <RhfRadioGroup
                  control={formHook.control}
                  legend="Er brukeren kjent med at saken vurderes på nytt?"
                  name={`perioder.${selectedId}.erBrukerInformert`}
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value="ja">Ja (det sendes vedtaksbrev)</Radio>
                  <Radio value="nei">
                    Nei (det sendes <b>ikke</b> vedtaksbrev)
                  </Radio>
                </RhfRadioGroup>
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
