import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
import { BostedsavklaringKildeType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsavklaringKildeType.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
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
import { opphørsårsakLabels } from '../../aktivitetspenger-prosess/types.js';
import { getDateRangeFromVilkår, OpphørAvslagValg } from '../formfields/OpphørAvslagValg.js';
import { OpphørForhåndsvarselModal } from '../formfields/OpphørForhåndsvarselModal.js';
import { OpphørKilde } from '../formfields/OpphørKilde.js';
import { getOpphørPeriods } from '../formfields/OpphørPerioder.js';
import { OpphørVarsel } from '../formfields/OpphørVarsel.js';
import type { OpphørVarselPeriodForm } from '../formfields/OpphørVarselFormData.js';
import type { OpphørÅrsakOgVarselProps } from '../types.js';

const kildeLabels: Record<BostedsavklaringKildeType, string> = {
  [BostedsavklaringKildeType.BRUKER]: 'Bruker',
  [BostedsavklaringKildeType.FOLKEREGISTER]: 'Register',
  [BostedsavklaringKildeType.ANNET]: 'Annet',
};

interface BostedPeriodForm extends OpphørVarselPeriodForm {
  avslagFom: string;
  avslagTom: string;
  kilde: BostedsavklaringKildeType | '';
  kildeFritekst: string;
  opphøreEllerAvslå: string;
  opphørsdato: string;
  årsak?: BostedsvilkårIkkeOppfyltÅrsak;
  skalSendeVarselOmOpphør: string;
}

interface BostedFormData {
  perioder: Record<string, BostedPeriodForm>;
}

const tilOpphøreEllerAvslå = (avklaringtype?: Avklaringtype): string => {
  if (avklaringtype === Avklaringtype.OPPHØR) return 'opphøre';
  if (avklaringtype === Avklaringtype.AVSLAG) return 'avslå';
  return '';
};

const tilJaEllerNei = (verdi?: boolean | null): string => {
  if (verdi === true) return 'ja';
  if (verdi === false) return 'nei';
  return '';
};

const erBostedsavklaringKilde = (verdi: string): verdi is BostedsavklaringKildeType =>
  Object.values<string>(BostedsavklaringKildeType).includes(verdi);

const erBostedsvilkårIkkeOppfyltÅrsak = (verdi: string): verdi is BostedsvilkårIkkeOppfyltÅrsak =>
  Object.values<string>(BostedsvilkårIkkeOppfyltÅrsak).includes(verdi);

const buildInitialValues = (vilkårsavklaringer: VilkårsavklaringerDto): BostedFormData => ({
  perioder: Object.fromEntries(
    vilkårsavklaringer.perioder.map(({ periode, avklaring }) => [
      periode.fom,
      {
        avslagFom: avklaring?.periode.fom ?? '',
        avslagTom: avklaring?.periode.tom ?? '',
        begrunnelseForIkkeVarsle: avklaring?.begrunnelseIkkeVarsel ?? '',
        fritekstTilVarsel: avklaring?.fritekstTilVarsel ?? '',
        kilde: avklaring && erBostedsavklaringKilde(avklaring.kilde) ? avklaring.kilde : '',
        kildeFritekst: avklaring?.kildeFritekst ?? '',
        opphøreEllerAvslå: tilOpphøreEllerAvslå(avklaring?.avklaringtype),
        opphørsdato: avklaring?.periode.fom ?? '',
        årsak:
          avklaring && erBostedsvilkårIkkeOppfyltÅrsak(avklaring.ikkeOppfyltÅrsak)
            ? avklaring.ikkeOppfyltÅrsak
            : undefined,
        skalSendeVarselOmOpphør: tilJaEllerNei(avklaring?.skalSendeVarsel),
      },
    ]),
  ),
});
interface SubmitArgs {
  formData: BostedFormData;
  selectedId: string;
}

const buildPayload = ({ formData, selectedId }: SubmitArgs) => {
  const selectedPeriod = formData.perioder[selectedId];
  if (!selectedPeriod) throw new Error('Kunne ikke finne valgt periode for opphør');
  if (!selectedPeriod.årsak) throw new Error('Årsak for valgt periode er ikke satt');
  if (!selectedPeriod.kilde) throw new Error('Kilde for valgt periode er ikke satt');
  const isOpphør = selectedPeriod.opphøreEllerAvslå === 'opphøre';
  const skalSendeVarsel = selectedPeriod.skalSendeVarselOmOpphør === 'ja';
  const avklaring = {
    periode: {
      fom: isOpphør ? selectedPeriod.opphørsdato : selectedPeriod.avslagFom,
      tom: isOpphør ? undefined : selectedPeriod.avslagTom,
    },
    skalIkkeSendeVarsel: !skalSendeVarsel,
    vurdering: {
      begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_BOSTED',
      fraflyttingsÅrsak: selectedPeriod.årsak,
      begrunnelseIkkeVarsel: !skalSendeVarsel ? selectedPeriod.begrunnelseForIkkeVarsle : undefined,
      fritekstTilVarsel: skalSendeVarsel ? selectedPeriod.fritekstTilVarsel : undefined,
      kilde: selectedPeriod.kilde,
      kildeFritekst:
        selectedPeriod.kilde === BostedsavklaringKildeType.ANNET ? selectedPeriod.kildeFritekst : undefined,
    },
  };
  const avklaringer: [typeof avklaring] = [avklaring];
  return {
    '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED,
    begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_BOSTED',
    avklaringer,
  };
};

export const BostedÅrsakOgVarsel = ({
  vurderFaktaAP,
  vilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: OpphørÅrsakOgVarselProps) => {
  const queryClient = useQueryClient();
  const vilkårsavklaringerOptions = vilkårsavklaringerQueryOptions(api, behandling, vilkarType.BOSTEDSVILKÅR);
  const { data: vilkårsavklaringer } = useSuspenseQuery(vilkårsavklaringerOptions);
  const periods = getOpphørPeriods({
    aksjonspunkt: vurderFaktaAP,
    perioder: vilkårsavklaringer.perioder.map(({ periode, utfall, avklaring }) => ({
      fom: periode.fom,
      tom: periode.tom,
      status: getPeriodStatus(utfall),
      foreslåttIBehandlingen: avklaring?.foreslåttIBehandlingen,
      avklaringtype: avklaring?.avklaringtype,
    })),
  });
  const [selectedId, setSelectedId] = useState(() => getDefaultSelectedPeriodId(periods));
  const [visBekreftSubmitModal, setVisBekreftSubmitModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<SubmitArgs | null>(null);
  const formHook = useForm<BostedFormData>({ defaultValues: buildInitialValues(vilkårsavklaringer) });
  const selectedPeriod = vilkårsavklaringer.perioder.find(p => p.periode.fom === selectedId);
  const valgtPeriodeErReadOnly =
    !!selectedPeriod && (!selectedPeriod.avklaring || !selectedPeriod.avklaring.foreslåttIBehandlingen);
  const formPerioder = formHook.watch('perioder');
  const valgtFormPeriode = formPerioder[selectedId];
  const opphøreEllerAvslå = valgtFormPeriode?.opphøreEllerAvslå ?? '';
  const valgtKilde = valgtFormPeriode?.kilde ?? '';
  const skalSendeForhåndsvarsel = valgtFormPeriode?.skalSendeVarselOmOpphør ?? '';
  const valgtÅrsak = valgtFormPeriode?.årsak;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (submitArgs: SubmitArgs) => {
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [buildPayload(submitArgs)]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vilkårsavklaringerOptions.queryKey });
      onAksjonspunktBekreftet();
    },
  });
  const relevanteBostedsvilkårIkkeOppfyltÅrsaker = Object.values(BostedsvilkårIkkeOppfyltÅrsak).filter(
    årsak =>
      årsak === BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM ||
      årsak === BostedsvilkårIkkeOppfyltÅrsak.STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM ||
      årsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET,
  );
  const handleSubmit = async (data: BostedFormData, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => {
    const submitArgs = { formData: data, selectedId };
    if (skalSendeForhåndsvarsel === 'ja') {
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
      {vurderFaktaAP && vurderFaktaAP.status !== AksjonspunktStatus.UTFØRT && (
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
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Ikke lenger bosatt i Trondheim kommune"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse="§ 2"
        defaultIsLocked={vurderFaktaAP?.status === AksjonspunktStatus.UTFØRT}
        readOnly={readOnly || valgtPeriodeErReadOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        lockedContent={
          vurderFaktaAP?.status === AksjonspunktStatus.UTFØRT ? (
            <VurdertAv ident={vurderFaktaAP.ansvarligSaksbehandler} />
          ) : undefined
        }
        beforeDetailContent={
          valgtPeriodeErReadOnly && selectedPeriod?.utfall === Utfall.OPPFYLT ? (
            <InfoCard data-color="info" size="small">
              <InfoCard.Message icon={<InformationSquareFillIcon aria-hidden color="var(--ax-text-info-decoration)" />}>
                Alle vilkår er innvilget i perioden.
              </InfoCard.Message>
            </InfoCard>
          ) : undefined
        }
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
                  selectValues={relevanteBostedsvilkårIkkeOppfyltÅrsaker.map(årsak => (
                    <option key={årsak} value={årsak}>
                      {opphørsårsakLabels[årsak]}
                    </option>
                  ))}
                />
                <OpphørKilde
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked || isPending}
                  valgtKilde={valgtKilde}
                  kildeOptions={Object.values(BostedsavklaringKildeType).map(kilde => ({
                    value: kilde,
                    label: kildeLabels[kilde],
                  }))}
                  kildeAnnetValue={BostedsavklaringKildeType.ANNET}
                />
                <OpphørVarsel
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked || isPending}
                  skalSendeForhåndsvarsel={skalSendeForhåndsvarsel}
                  skalViseForhåndsvarselTekst={valgtÅrsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET}
                  forhåndsvarselBeskrivelse="Forklar hvorfor du har satt dato for opphør med årsak at bruker ikke lenger er bosatt i Trondheim kommune."
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
