import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/Avklaringtype.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BostedGrunnlagResponseDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, InfoCard, VStack } from '@navikt/ds-react';
import { RhfForm, RhfSelect } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VilkårSplittPanel } from '../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  BostedsavklaringKildeType,
  BostedsvilkårIkkeOppfyltÅrsak,
  kildeLabels,
  opphørsårsakLabels,
} from '../aktivitetspenger-prosess/types.js';
import { OpphørAvslagValg, getDateRangeFromVilkår } from './formfields/OpphørAvslagValg.js';
import { OpphørForhåndsvarselModal } from './formfields/OpphørForhåndsvarselModal.js';
import { OpphørKilde } from './formfields/OpphørKilde.js';
import { getOpphørPeriods } from './formfields/OpphørPerioder.js';
import { OpphørVarsel } from './formfields/OpphørVarsel.js';
import type { OpphørVarselPeriodForm } from './formfields/OpphørVarselFormData.js';

interface BostedPeriodForm extends OpphørVarselPeriodForm {
  avslagFom: string;
  avslagTom: string;
  kilde: string;
  kildeFritekst: string;
  opphøreEllerAvslå: string;
  opphørsdato: string;
  årsak: string;
  skalSendeVarselOmOpphør: string;
}

interface BostedFormData {
  perioder: Record<string, BostedPeriodForm>;
}

const buildInitialValues = (bostedGrunnlag: BostedGrunnlagResponseDto): BostedFormData => ({
  perioder: Object.fromEntries(
    (bostedGrunnlag.perioder ?? []).map(p => [
      p.fom,
      {
        avslagFom: p.avklaring?.foreslåttPeriode?.fom ?? '',
        avslagTom: p.avklaring?.foreslåttPeriode?.tom ?? '',
        begrunnelseForIkkeVarsle: p.avklaring?.begrunnelseIkkeVarsel ?? '',
        forhåndsvarselTekst: p.avklaring?.fritekstTilVarsel ?? '',
        kilde: p.avklaring?.kilde ?? '',
        kildeFritekst: p.avklaring?.kildeFritekst ?? '',
        opphøreEllerAvslå:
          p.avklaring?.avklaringtype === Avklaringtype.OPPHØR
            ? 'opphøre'
            : p.avklaring?.avklaringtype === Avklaringtype.AVSLAG
              ? 'avslå'
              : '',
        opphørsdato: p.avklaring?.foreslåttPeriode?.fom ?? '',
        årsak: p.avklaring?.ikkeOppfyltÅrsak ?? '',
        skalSendeVarselOmOpphør:
          p.avklaring?.skalSendeVarsel === true ? 'ja' : p.avklaring?.skalSendeVarsel === false ? 'nei' : '',
      },
    ]),
  ),
});
const buildPayload = ({ formData, selectedId }: { formData: BostedFormData; selectedId: string }) => {
  const selectedPeriod = formData.perioder[selectedId];
  if (!selectedPeriod) throw new Error('Kunne ikke finne valgt periode for opphør');
  const isOpphør = selectedPeriod.opphøreEllerAvslå === 'opphøre';
  const skalSendeVarsel = selectedPeriod.skalSendeVarselOmOpphør === 'ja';
  return {
    '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED,
    begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_BOSTED',
    avklaringer: [
      {
        periode: {
          fom: isOpphør ? selectedPeriod.opphørsdato : selectedPeriod.avslagFom,
          tom: isOpphør ? undefined : selectedPeriod.avslagTom,
        },
        skalIkkeSendeVarsel: !skalSendeVarsel,
        vurdering: {
          begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_BOSTED',
          fraflyttingsÅrsak: selectedPeriod.årsak as BostedsvilkårIkkeOppfyltÅrsak,
          begrunnelseIkkeVarsel: !skalSendeVarsel ? selectedPeriod.begrunnelseForIkkeVarsle : undefined,
          fritekstTilVarsel: skalSendeVarsel ? selectedPeriod.forhåndsvarselTekst : undefined,
          kilde: selectedPeriod.kilde as BostedsavklaringKildeType,
          kildeFritekst:
            selectedPeriod.kilde === BostedsavklaringKildeType.ANNET ? selectedPeriod.kildeFritekst : undefined,
        },
      },
    ],
  };
};

interface Props {
  vurderBostedAP?: AksjonspunktDto;
  bostedVilkår: VilkårMedPerioderDto;
  bostedGrunnlag: BostedGrunnlagResponseDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}

export const BostedÅrsakOgVarsel = ({
  vurderBostedAP,
  bostedVilkår,
  bostedGrunnlag,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: Props) => {
  const periods = getOpphørPeriods({
    aksjonspunkt: vurderBostedAP,
    perioder: (bostedGrunnlag.perioder ?? []).map(periode => ({
      fom: periode.fom,
      tom: periode.tom,
      status: periode.resultat ? (periode.resultat.erBosatt ? 'success' : 'error') : 'warning',
    })),
  });
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const [visBekreftSubmitModal, setVisBekreftSubmitModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<BostedFormData | null>(null);
  const formHook = useForm<BostedFormData>({ defaultValues: buildInitialValues(bostedGrunnlag) });
  const watchValue = (name: string) => String(formHook.watch(name as never) ?? '');
  const selectedPeriod = bostedGrunnlag.perioder?.find(p => p.fom === selectedId);
  const valgtPeriodeErReadOnly =
    !!selectedPeriod && (!selectedPeriod.avklaring || selectedPeriod.avklaring.kanRedigeres !== true);
  const opphøreEllerAvslå = watchValue(`perioder.${selectedId}.opphøreEllerAvslå`);
  const valgtKilde = watchValue(`perioder.${selectedId}.kilde`);
  const skalSendeForhåndsvarsel = watchValue(`perioder.${selectedId}.skalSendeVarselOmOpphør`);
  const valgtÅrsak = watchValue(`perioder.${selectedId}.årsak`);

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (formData: BostedFormData) => {
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [buildPayload({ formData, selectedId })]);
    },
    onSuccess: onAksjonspunktBekreftet,
  });
  const relevanteBostedsvilkårIkkeOppfyltÅrsaker = Object.values(BostedsvilkårIkkeOppfyltÅrsak).filter(
    årsak =>
      årsak === BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM ||
      årsak === BostedsvilkårIkkeOppfyltÅrsak.STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM ||
      årsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET,
  );
  const handleSubmit = async (data: BostedFormData, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (skalSendeForhåndsvarsel === 'ja') {
      setPendingSubmitData(data);
      setVisBekreftSubmitModal(true);
      return;
    }
    await bekreftAksjonspunktMutation(data);
    setIsFormLocked(true);
  };

  const bekreftOgSendForhåndsvarsel = async (setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!pendingSubmitData) {
      return;
    }
    await bekreftAksjonspunktMutation(pendingSubmitData);
    setVisBekreftSubmitModal(false);
    setPendingSubmitData(null);
    setIsFormLocked(true);
  };

  return (
    <VStack gap="space-20">
      {vurderBostedAP && vurderBostedAP.status !== AksjonspunktStatus.UTFØRT && (
        <Alert variant="warning" size="small">
          Vurder årsak til opphør og om bruker skal varsles.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Ikke lenger bosatt i Trondheim kommune"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse={bostedVilkår.lovReferanse}
        defaultIsLocked={vurderBostedAP?.status === AksjonspunktStatus.UTFØRT}
        readOnly={readOnly || valgtPeriodeErReadOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        lockedContent={
          vurderBostedAP?.status === AksjonspunktStatus.UTFØRT ? (
            <VurdertAv ident={vurderBostedAP.ansvarligSaksbehandler} />
          ) : undefined
        }
        beforeDetailContent={
          valgtPeriodeErReadOnly && selectedPeriod?.resultat?.erBosatt ? (
            <InfoCard data-color="info">
              <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
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
                  isFormLocked={isFormLocked}
                  opphøreEllerAvslå={opphøreEllerAvslå}
                  dateRange={getDateRangeFromVilkår(bostedVilkår.perioder)}
                />
                <RhfSelect
                  control={formHook.control}
                  name={`perioder.${selectedId}.årsak`}
                  label="Velg årsak"
                  readOnly={isFormLocked}
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
                  isFormLocked={isFormLocked}
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
                  isFormLocked={isFormLocked}
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
                  setPendingSubmitData(null);
                }}
              />
            )}
          </>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
