import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
import { BistandsavklaringKildeType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsavklaringKildeType.js';
import { BistandsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsvilkårIkkeOppfyltÅrsak.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårsavklaringerDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import { ExclamationmarkTriangleFillIcon, InformationSquareFillIcon } from '@navikt/aksel-icons';
import { Button, HStack, InfoCard, VStack } from '@navikt/ds-react';
import { RhfForm, RhfSelect } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getDefaultSelectedPeriodId,
  getPeriodStatus,
  VilkårSplittPanel,
} from '../../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv.js';
import type { AktivitetspengerApi } from '../../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { vilkårsavklaringerQueryOptions } from '../../aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { getDateRangeFromVilkår, OpphørAvslagValg } from '../formfields/OpphørAvslagValg.js';
import { OpphørForhåndsvarselModal } from '../formfields/OpphørForhåndsvarselModal.js';
import { OpphørKilde } from '../formfields/OpphørKilde.js';
import { getOpphørPeriods, IKKE_SATT_PERIODE_ID } from '../formfields/OpphørPerioder.js';
import { OpphørVarsel } from '../formfields/OpphørVarsel.js';
import type { OpphørVarselPeriodForm } from '../formfields/OpphørVarselFormData.js';

const kildeLabels: Record<BistandsavklaringKildeType, string> = {
  [BistandsavklaringKildeType.BRUKER]: 'Bruker selv',
  [BistandsavklaringKildeType.ANNET]: 'Annet',
};

const bistandOpphørsårsaker = [
  { value: BistandsvilkårIkkeOppfyltÅrsak.KOMMET_I_ARBEID, label: 'Har kommet i jobb' },
  {
    value: BistandsvilkårIkkeOppfyltÅrsak.KOMMET_I_UTDANNING,
    label: 'Har startet i utdanning som ikke er et arbeidsmarkedstiltak',
  },
  { value: BistandsvilkårIkkeOppfyltÅrsak.ANNET, label: 'Annen årsak' },
] satisfies { value: BistandsvilkårIkkeOppfyltÅrsak; label: string }[];

interface BistandPeriodForm extends OpphørVarselPeriodForm {
  avslagFom: string;
  avslagTom: string;
  kilde: BistandsavklaringKildeType | '';
  kildeFritekst: string;
  opphøreEllerAvslå: string;
  opphørsdato: string;
  årsak: BistandsvilkårIkkeOppfyltÅrsak | '';
  skalSendeVarselOmOpphør: string;
}

interface BistandFormData {
  perioder: Record<string, BistandPeriodForm>;
}

const erBistandsavklaringKilde = (verdi: string): verdi is BistandsavklaringKildeType =>
  Object.values<string>(BistandsavklaringKildeType).includes(verdi);

const erBistandsvilkårIkkeOppfyltÅrsak = (verdi: string): verdi is BistandsvilkårIkkeOppfyltÅrsak =>
  Object.values<string>(BistandsvilkårIkkeOppfyltÅrsak).includes(verdi);

const tilOpphøreEllerAvslå = (avklaringtype?: Avklaringtype): string => {
  if (avklaringtype === Avklaringtype.OPPHØR) return 'opphøre';
  if (avklaringtype === Avklaringtype.AVSLAG) return 'avslå';
  return '';
};

const tilJaEllerNei = (verdi?: boolean): string => {
  if (verdi === true) return 'ja';
  if (verdi === false) return 'nei';
  return '';
};

// Årsak er skrivebeskyttet og satt til ANNET inntil videre, også for en ny periode som ikke er satt
const nyPeriode: BistandPeriodForm = {
  avslagFom: '',
  avslagTom: '',
  begrunnelseForIkkeVarsle: '',
  fritekstTilVarsel: '',
  kilde: '',
  kildeFritekst: '',
  opphøreEllerAvslå: '',
  opphørsdato: '',
  årsak: BistandsvilkårIkkeOppfyltÅrsak.ANNET,
  skalSendeVarselOmOpphør: '',
};

const buildInitialValues = (vilkårsavklaringer: VilkårsavklaringerDto): BistandFormData => ({
  perioder: {
    [IKKE_SATT_PERIODE_ID]: nyPeriode,
    ...Object.fromEntries(
      vilkårsavklaringer.perioder.map(({ periode, avklaring }) => [
        periode.fom,
        {
          avslagFom: avklaring?.periode.fom ?? periode.fom,
          avslagTom: avklaring ? (avklaring.periode.tom ?? '') : (periode.tom ?? ''),
          begrunnelseForIkkeVarsle: avklaring?.begrunnelseIkkeVarsel ?? '',
          fritekstTilVarsel: avklaring?.fritekstTilVarsel ?? '',
          kilde: avklaring && erBistandsavklaringKilde(avklaring.kilde) ? avklaring.kilde : '',
          kildeFritekst: avklaring?.kildeFritekst ?? '',
          opphøreEllerAvslå: tilOpphøreEllerAvslå(avklaring?.avklaringtype),
          opphørsdato: avklaring?.periode.fom ?? periode.fom,
          årsak:
            avklaring && erBistandsvilkårIkkeOppfyltÅrsak(avklaring.ikkeOppfyltÅrsak)
              ? avklaring.ikkeOppfyltÅrsak
              : BistandsvilkårIkkeOppfyltÅrsak.ANNET,
          skalSendeVarselOmOpphør: tilJaEllerNei(avklaring?.skalSendeVarsel),
        },
      ]),
    ),
  },
});

interface SubmitArgs {
  formData: BistandFormData;
  selectedId: string;
}

const buildPayload = ({ formData, selectedId }: SubmitArgs) => {
  const selectedPeriod = formData.perioder[selectedId];
  if (!selectedPeriod) throw new Error('Kunne ikke finne valgt periode for bistand');
  if (!selectedPeriod.årsak) throw new Error('Årsak for valgt periode er ikke satt');
  if (!selectedPeriod.kilde) throw new Error('Kilde for valgt periode er ikke satt');
  const isOpphør = selectedPeriod.opphøreEllerAvslå === 'opphøre';
  const skalSendeVarsel = selectedPeriod.skalSendeVarselOmOpphør === 'ja';
  const avklaring = {
    periode: {
      fom: isOpphør ? selectedPeriod.opphørsdato : selectedPeriod.avslagFom,
      tom: isOpphør ? undefined : selectedPeriod.avslagTom,
    },
    avklaring: {
      begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_BISTAND',
      begrunnelseIkkeVarsel: !skalSendeVarsel ? selectedPeriod.begrunnelseForIkkeVarsle : undefined,
      fritekstTilVarsel:
        skalSendeVarsel && selectedPeriod.årsak === BistandsvilkårIkkeOppfyltÅrsak.ANNET
          ? selectedPeriod.fritekstTilVarsel
          : undefined,
      ikkeOppfyltÅrsak: selectedPeriod.årsak,
      kilde: selectedPeriod.kilde,
      kildeFritekst:
        selectedPeriod.kilde === BistandsavklaringKildeType.ANNET ? selectedPeriod.kildeFritekst : undefined,
      skalIkkeSendeVarsel: !skalSendeVarsel,
    },
  };
  const avklaringer: [typeof avklaring] = [avklaring];
  return {
    '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND,
    begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_BISTAND',
    avklaringer,
  };
};

interface Props {
  vurderBistandFaktaAP?: AksjonspunktDto;
  bistandVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}

export const BistandÅrsakOgVarsel = ({
  vurderBistandFaktaAP,
  bistandVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: Props) => {
  const queryClient = useQueryClient();
  const vilkårsavklaringerOptions = vilkårsavklaringerQueryOptions(api, behandling, vilkarType.BISTANDSVILKÅR);
  const { data: vilkårsavklaringer } = useSuspenseQuery(vilkårsavklaringerOptions);
  const opphørPeriods = getOpphørPeriods({
    aksjonspunkt: vurderBistandFaktaAP,
    perioder: vilkårsavklaringer.perioder.map(({ periode, utfall, avklaring }) => ({
      fom: periode.fom,
      tom: periode.tom,
      status: getPeriodStatus(utfall),
      foreslåttIBehandlingen: avklaring?.foreslåttIBehandlingen,
      avklaringtype: avklaring?.avklaringtype,
    })),
  });
  const [selectedId, setSelectedId] = useState(() => getDefaultSelectedPeriodId(opphørPeriods));
  const [visBekreftSubmitModal, setVisBekreftSubmitModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<SubmitArgs | null>(null);
  const formHook = useForm<BistandFormData>({ defaultValues: buildInitialValues(vilkårsavklaringer) });
  const formPerioder = formHook.watch('perioder');
  const valgtFormPeriode = formPerioder[selectedId];
  const valgtOpphørPeriode = opphørPeriods.find(periode => periode.id === selectedId);
  const valgtVilkårsavklaringPeriode = vilkårsavklaringer.perioder.find(p => p.periode.fom === selectedId);
  const opphøreEllerAvslå = valgtFormPeriode?.opphøreEllerAvslå ?? '';
  const valgtKilde = valgtFormPeriode?.kilde ?? '';
  const skalSendeVarselOmOpphør = valgtFormPeriode?.skalSendeVarselOmOpphør ?? '';
  const valgtÅrsak = valgtFormPeriode?.årsak ?? '';
  const isSolved = vurderBistandFaktaAP?.status === AksjonspunktStatus.UTFØRT;
  const erValgtPeriodeInnvilgetUtenAvklaring =
    valgtOpphørPeriode?.status === 'success' && !valgtVilkårsavklaringPeriode?.avklaring;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (submitArgs: SubmitArgs) => {
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [buildPayload(submitArgs)]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vilkårsavklaringerOptions.queryKey });
      onAksjonspunktBekreftet();
    },
  });

  const handleSubmit = async (
    data: BistandFormData,
    setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const submitArgs = { formData: data, selectedId };
    if (skalSendeVarselOmOpphør === 'ja') {
      setPendingSubmit(submitArgs);
      setVisBekreftSubmitModal(true);
      return;
    }
    await bekreftAksjonspunktMutation(submitArgs);
    setIsFormLocked(true);
  };

  const bekreftOgSendForhåndsvarsel = async (setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!pendingSubmit) {
      return;
    }
    await bekreftAksjonspunktMutation(pendingSubmit);
    setVisBekreftSubmitModal(false);
    setPendingSubmit(null);
    setIsFormLocked(true);
  };

  return (
    <VStack gap="space-20">
      {!isSolved && vurderBistandFaktaAP && (
        <InfoCard data-color="warning" size="small">
          <InfoCard.Message
            icon={<ExclamationmarkTriangleFillIcon aria-hidden color="var(--ax-text-warning-decoration)" />}
          >
            Vurder årsak til opphør og om bruker skal varsles.
          </InfoCard.Message>
        </InfoCard>
      )}
      <VilkårSplittPanel
        isAktivitetspenger
        periods={opphørPeriods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Ikke lenger behov for bistand"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse="§ 6"
        defaultIsLocked={isSolved}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly || erValgtPeriodeInnvilgetUtenAvklaring}
        beforeDetailContent={
          erValgtPeriodeInnvilgetUtenAvklaring ? (
            <InfoCard data-color="info" size="small">
              <InfoCard.Message icon={<InformationSquareFillIcon aria-hidden color="var(--ax-text-info-decoration)" />}>
                Alle vilkår er innvilget i perioden.
              </InfoCard.Message>
            </InfoCard>
          ) : undefined
        }
        lockedContent={isSolved ? <VurdertAv ident={vurderBistandFaktaAP?.ansvarligSaksbehandler} /> : undefined}
      >
        {(isFormLocked, setIsFormLocked) => (
          <>
            <RhfForm formMethods={formHook} onSubmit={data => handleSubmit(data, setIsFormLocked)}>
              <VStack gap="space-24" maxWidth="70ch" width="100%">
                <OpphørAvslagValg
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked}
                  opphøreEllerAvslå={opphøreEllerAvslå}
                  avslagFom={valgtFormPeriode?.avslagFom ?? ''}
                  dateRange={getDateRangeFromVilkår(bistandVilkår.perioder)}
                />
                <RhfSelect
                  control={formHook.control}
                  name={`perioder.${selectedId}.årsak`}
                  label="Velg årsak"
                  readOnly
                  validate={[required]}
                  selectValues={bistandOpphørsårsaker.map(årsak => (
                    <option key={årsak.value} value={årsak.value}>
                      {årsak.label}
                    </option>
                  ))}
                />
                <OpphørKilde
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked}
                  valgtKilde={valgtKilde}
                  kildeOptions={Object.values(BistandsavklaringKildeType).map(kilde => ({
                    value: kilde,
                    label: kildeLabels[kilde],
                  }))}
                  kildeAnnetValue={BistandsavklaringKildeType.ANNET}
                />
                <OpphørVarsel
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked}
                  skalSendeForhåndsvarsel={skalSendeVarselOmOpphør}
                  skalViseForhåndsvarselTekst={valgtÅrsak === BistandsvilkårIkkeOppfyltÅrsak.ANNET}
                  forhåndsvarselBeskrivelse="Forklar hvorfor du har satt dato for opphør med årsak at bruker ikke lenger har behov for bistand."
                />
                {!isFormLocked && (
                  <HStack gap="space-24">
                    <Button type="submit" size="small" loading={isPending}>
                      Bekreft og fortsett
                    </Button>
                  </HStack>
                )}
              </VStack>
            </RhfForm>
            {visBekreftSubmitModal && (
              <OpphørForhåndsvarselModal
                open={visBekreftSubmitModal}
                isPending={isPending}
                onClose={() => setVisBekreftSubmitModal(false)}
                onConfirm={() => void bekreftOgSendForhåndsvarsel(setIsFormLocked)}
                onCancel={() => {
                  setVisBekreftSubmitModal(false);
                  setPendingSubmit(null);
                }}
              />
            )}
          </>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
