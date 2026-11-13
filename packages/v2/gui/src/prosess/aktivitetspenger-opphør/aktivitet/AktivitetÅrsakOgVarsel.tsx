import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
import { AktivitetsavklaringKildeType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AktivitetsavklaringKildeType.js';
import { AktivitetsvilkåretIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AktivitetsvilkåretIkkeOppfyltÅrsak.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
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
import { vilkårsavklaringerQueryOptions } from '../../aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { getDateRangeFromVilkår, OpphørAvslagValg } from '../formfields/OpphørAvslagValg.js';
import { OpphørForhåndsvarselModal } from '../formfields/OpphørForhåndsvarselModal.js';
import { OpphørKilde } from '../formfields/OpphørKilde.js';
import { getOpphørPeriods } from '../formfields/OpphørPerioder.js';
import { OpphørVarsel } from '../formfields/OpphørVarsel.js';
import type { OpphørVarselPeriodForm } from '../formfields/OpphørVarselFormData.js';
import type { OpphørÅrsakOgVarselProps } from '../types.js';

const kildeOptions = [
  { value: AktivitetsavklaringKildeType.BRUKER, label: 'Bruker selv' },
  { value: AktivitetsavklaringKildeType.ANNET, label: 'Annet' },
] satisfies { value: AktivitetsavklaringKildeType; label: string }[];

const aktivitetOpphørsårsaker = [{ value: AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET, label: 'Annen årsak' }] satisfies {
  value: AktivitetsvilkåretIkkeOppfyltÅrsak;
  label: string;
}[];

interface AktivitetPeriodForm extends OpphørVarselPeriodForm {
  avslagFom: string;
  avslagTom: string;
  kilde: AktivitetsavklaringKildeType | '';
  kildeFritekst: string;
  opphøreEllerAvslå: string;
  opphørsdato: string;
  årsak: AktivitetsvilkåretIkkeOppfyltÅrsak | '';
  skalSendeVarselOmOpphør: string;
}

interface AktivitetFormData {
  perioder: Record<string, AktivitetPeriodForm>;
}

const erAktivitetsavklaringKilde = (verdi: string): verdi is AktivitetsavklaringKildeType =>
  kildeOptions.some(kilde => kilde.value === verdi);

const erAktivitetsvilkåretIkkeOppfyltÅrsak = (verdi: string): verdi is AktivitetsvilkåretIkkeOppfyltÅrsak =>
  verdi === AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET;

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

const buildInitialValues = (vilkårsavklaringer: VilkårsavklaringerDto): AktivitetFormData => ({
  perioder: Object.fromEntries(
    vilkårsavklaringer.perioder.map(({ periode, avklaring }) => [
      periode.fom,
      {
        avslagFom: avklaring?.periode.fom ?? periode.fom,
        avslagTom: avklaring ? (avklaring.periode.tom ?? '') : (periode.tom ?? ''),
        begrunnelseForIkkeVarsle: avklaring?.begrunnelseIkkeVarsel ?? '',
        fritekstTilVarsel: avklaring?.fritekstTilVarsel ?? '',
        kilde: avklaring && erAktivitetsavklaringKilde(avklaring.kilde) ? avklaring.kilde : '',
        kildeFritekst: avklaring?.kildeFritekst ?? '',
        opphøreEllerAvslå: tilOpphøreEllerAvslå(avklaring?.avklaringtype),
        opphørsdato: avklaring?.periode.fom ?? periode.fom,
        årsak:
          avklaring && erAktivitetsvilkåretIkkeOppfyltÅrsak(avklaring.ikkeOppfyltÅrsak)
            ? avklaring.ikkeOppfyltÅrsak
            : '',
        skalSendeVarselOmOpphør: tilJaEllerNei(avklaring?.skalSendeVarsel),
      },
    ]),
  ),
});

interface SubmitArgs {
  formData: AktivitetFormData;
  selectedId: string;
}

const buildPayload = ({ formData, selectedId }: SubmitArgs) => {
  const selectedPeriod = formData.perioder[selectedId];
  if (!selectedPeriod) throw new Error('Kunne ikke finne valgt periode for aktivitet');
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
      begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_AKTIVITET',
      begrunnelseIkkeVarsel: !skalSendeVarsel ? selectedPeriod.begrunnelseForIkkeVarsle : undefined,
      fritekstTilVarsel:
        skalSendeVarsel && selectedPeriod.årsak === AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET
          ? selectedPeriod.fritekstTilVarsel
          : undefined,
      ikkeOppfyltÅrsak: selectedPeriod.årsak,
      kilde: selectedPeriod.kilde,
      kildeFritekst:
        selectedPeriod.kilde === AktivitetsavklaringKildeType.ANNET ? selectedPeriod.kildeFritekst : undefined,
      skalIkkeSendeVarsel: !skalSendeVarsel,
    },
  };
  const avklaringer: [typeof avklaring] = [avklaring];
  return {
    '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_AKTIVITET,
    begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_AKTIVITET',
    avklaringer,
  };
};

export const AktivitetÅrsakOgVarsel = ({
  vurderFaktaAP,
  vilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: OpphørÅrsakOgVarselProps) => {
  const queryClient = useQueryClient();
  const vilkårsavklaringerOptions = vilkårsavklaringerQueryOptions(api, behandling, vilkarType.AKTIVITETSVILKÅR);
  const { data: vilkårsavklaringer } = useSuspenseQuery(vilkårsavklaringerOptions);
  const opphørPeriods = getOpphørPeriods({
    aksjonspunkt: vurderFaktaAP,
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
  const formHook = useForm<AktivitetFormData>({ defaultValues: buildInitialValues(vilkårsavklaringer) });
  const formPerioder = formHook.watch('perioder');
  const valgtFormPeriode = formPerioder[selectedId];
  const valgtOpphørPeriode = opphørPeriods.find(periode => periode.id === selectedId);
  const valgtVilkårsavklaringPeriode = vilkårsavklaringer.perioder.find(p => p.periode.fom === selectedId);
  const opphøreEllerAvslå = valgtFormPeriode?.opphøreEllerAvslå ?? '';
  const valgtKilde = valgtFormPeriode?.kilde ?? '';
  const skalSendeVarselOmOpphør = valgtFormPeriode?.skalSendeVarselOmOpphør ?? '';
  const valgtÅrsak = valgtFormPeriode?.årsak ?? '';
  const isSolved = vurderFaktaAP?.status === AksjonspunktStatus.UTFØRT;
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
    data: AktivitetFormData,
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
      {!isSolved && vurderFaktaAP && (
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
        detailHeading="Ikke i aktivitet"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse="§ 8"
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
        lockedContent={isSolved ? <VurdertAv ident={vurderFaktaAP?.ansvarligSaksbehandler} /> : undefined}
      >
        {(isFormLocked, setIsFormLocked) => (
          <>
            <RhfForm formMethods={formHook} onSubmit={data => handleSubmit(data, setIsFormLocked)}>
              <VStack gap="space-24" maxWidth="70ch" width="100%">
                <OpphørAvslagValg
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked || isPending}
                  opphøreEllerAvslå={opphøreEllerAvslå}
                  avslagFom={valgtFormPeriode?.avslagFom ?? ''}
                  dateRange={getDateRangeFromVilkår(vilkår.perioder)}
                />
                <RhfSelect
                  control={formHook.control}
                  name={`perioder.${selectedId}.årsak`}
                  label="Velg årsak"
                  readOnly={isFormLocked || isPending}
                  validate={[required]}
                  selectValues={aktivitetOpphørsårsaker.map(årsak => (
                    <option key={årsak.value} value={årsak.value}>
                      {årsak.label}
                    </option>
                  ))}
                />
                <OpphørKilde
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked || isPending}
                  valgtKilde={valgtKilde}
                  kildeOptions={kildeOptions}
                  kildeAnnetValue={AktivitetsavklaringKildeType.ANNET}
                />
                <OpphørVarsel
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked || isPending}
                  skalSendeForhåndsvarsel={skalSendeVarselOmOpphør}
                  skalViseForhåndsvarselTekst={valgtÅrsak === AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET}
                  forhåndsvarselBeskrivelse="Forklar hvorfor du har satt dato for opphør med årsak at bruker ikke er i aktivitet."
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
