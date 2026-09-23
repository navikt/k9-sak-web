import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { AndreLivsoppholdsytelserAvklaringKildeType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserAvklaringKildeType.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { Alert, BodyShort, Button, HStack, List, ReadMore, VStack } from '@navikt/ds-react';
import { RhfForm, RhfSelect, RhfTextField } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VilkårSplittPanel } from '../../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv.js';
import { formatSnakeCaseLabel } from '../../../utils/formatters.js';
import type { AktivitetspengerApi } from '../../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { OpphørAvslagValg, getDateRangeFromVilkår } from '../formfields/OpphørAvslagValg.js';
import { OpphørForhåndsvarselModal } from '../formfields/OpphørForhåndsvarselModal.js';
import { OpphørKilde } from '../formfields/OpphørKilde.js';
import { getOpphørPeriods } from '../formfields/OpphørPerioder.js';
import { OpphørVarsel } from '../formfields/OpphørVarsel.js';
import type { OpphørVarselPeriodForm } from '../formfields/OpphørVarselFormData.js';

const kildeLabels: Record<AndreLivsoppholdsytelserAvklaringKildeType, string> = {
  [AndreLivsoppholdsytelserAvklaringKildeType.BRUKER]: 'Bruker',
  [AndreLivsoppholdsytelserAvklaringKildeType.NAV]: 'Nav',
  [AndreLivsoppholdsytelserAvklaringKildeType.ANNET]: 'Annet',
};

interface AndreLivsoppholdytelserPeriodForm extends OpphørVarselPeriodForm {
  avslagFom: string;
  avslagTom: string;
  kilde: string;
  kildeFritekst: string;
  livsoppholdytelse: string;
  opphøreEllerAvslå: string;
  opphørsdato: string;
  skalSendeVarselOmOpphør: string;
  annenLivsoppholdytelse?: string;
}

interface AndreLivsoppholdytelserFormData {
  perioder: Record<string, AndreLivsoppholdytelserPeriodForm>;
}

const buildInitialValues = (vilkår: VilkårMedPerioderDto): AndreLivsoppholdytelserFormData => ({
  perioder: Object.fromEntries(
    (vilkår.perioder ?? []).map(period => [
      period.periode.fom,
      {
        avslagFom: period.periode.fom,
        avslagTom: period.periode.tom ?? '',
        begrunnelseForIkkeVarsle: '',
        fritekstTilVarsel: '',
        kilde: '',
        kildeFritekst: '',
        livsoppholdytelse: '',
        opphøreEllerAvslå: '',
        opphørsdato: period.periode.fom,
        skalSendeVarselOmOpphør: '',
        annenLivsoppholdytelse: '',
      },
    ]),
  ),
});
const buildPayload = ({ formData, selectedId }: { formData: AndreLivsoppholdytelserFormData; selectedId: string }) => {
  const selectedPeriod = formData.perioder[selectedId];
  if (!selectedPeriod) throw new Error('Kunne ikke finne valgt periode for andre livsoppholdsytelser');
  const isOpphør = selectedPeriod.opphøreEllerAvslå === 'opphøre';
  const skalSendeVarsel = selectedPeriod.skalSendeVarselOmOpphør === 'ja';
  return {
    '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER,
    begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER',
    avklaringer: [
      {
        periode: {
          fom: isOpphør ? selectedPeriod.opphørsdato : selectedPeriod.avslagFom,
          tom: isOpphør ? undefined : selectedPeriod.avslagTom,
        },
        avklaring: {
          begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER',
          begrunnelseIkkeVarsel: !skalSendeVarsel ? selectedPeriod.begrunnelseForIkkeVarsle : undefined,
          fritekstTilVarsel:
            selectedPeriod.livsoppholdytelse === AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE
              ? selectedPeriod.annenLivsoppholdytelse
              : undefined,
          ikkeOppfyltÅrsak: selectedPeriod.livsoppholdytelse as AndreLivsoppholdsytelserIkkeOppfyltÅrsak,
          kilde: selectedPeriod.kilde as AndreLivsoppholdsytelserAvklaringKildeType,
          kildeFritekst:
            selectedPeriod.kilde === AndreLivsoppholdsytelserAvklaringKildeType.ANNET
              ? selectedPeriod.kildeFritekst
              : undefined,
          skalIkkeSendeVarsel: !skalSendeVarsel,
        },
      },
    ],
  };
};

const ikkeOppfyltÅrsaker = Object.values(AndreLivsoppholdsytelserIkkeOppfyltÅrsak).map(årsak => ({
  value: årsak,
  label: formatSnakeCaseLabel(årsak),
}));

interface Props {
  vurderAndreLivsoppholdytelserFaktaAP?: AksjonspunktDto;
  andreLivsoppholdytelserVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}

export const AndreLivsoppholdytelserÅrsakOgVarsel = ({
  vurderAndreLivsoppholdytelserFaktaAP,
  andreLivsoppholdytelserVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: Props) => {
  const periods = getOpphørPeriods({
    aksjonspunkt: vurderAndreLivsoppholdytelserFaktaAP,
    perioder: (andreLivsoppholdytelserVilkår.perioder ?? []).map(periode => ({
      fom: periode.periode.fom,
      tom: periode.periode.tom,
      status:
        periode.vilkarStatus === Utfall.OPPFYLT
          ? 'success'
          : periode.vilkarStatus === Utfall.IKKE_OPPFYLT
            ? 'error'
            : 'warning',
    })),
  });
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const [visBekreftSubmitModal, setVisBekreftSubmitModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<AndreLivsoppholdytelserFormData | null>(null);
  const formHook = useForm<AndreLivsoppholdytelserFormData>({
    defaultValues: buildInitialValues(andreLivsoppholdytelserVilkår),
  });
  const perioder = formHook.watch('perioder');
  const valgtPeriode = perioder[selectedId];
  const opphøreEllerAvslå = valgtPeriode?.opphøreEllerAvslå ?? '';
  const valgtKilde = valgtPeriode?.kilde ?? '';
  const skalSendeVarselOmOpphør = valgtPeriode?.skalSendeVarselOmOpphør ?? '';
  const valgtYtelse = valgtPeriode?.livsoppholdytelse ?? '';
  const isSolved = vurderAndreLivsoppholdytelserFaktaAP?.status === AksjonspunktStatus.UTFØRT;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (formData: AndreLivsoppholdytelserFormData) => {
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [buildPayload({ formData, selectedId })]);
    },
    onSuccess: onAksjonspunktBekreftet,
  });

  const handleSubmit = async (
    data: AndreLivsoppholdytelserFormData,
    setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const skalSendeForhåndsvarsel = skalSendeVarselOmOpphør === 'ja';
    if (skalSendeForhåndsvarsel) {
      setPendingSubmitData(data);
      setVisBekreftSubmitModal(true);
      return;
    }
    await bekreftAksjonspunktMutation(data);
    setIsFormLocked(true);
  };

  const bekreftOgSendForhåndsvarsel = async (setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!pendingSubmitData) return;
    await bekreftAksjonspunktMutation(pendingSubmitData);
    setVisBekreftSubmitModal(false);
    setPendingSubmitData(null);
    setIsFormLocked(true);
  };

  return (
    <VStack gap="space-20">
      {!isSolved && vurderAndreLivsoppholdytelserFaktaAP && (
        <Alert variant="warning" size="small">
          Vurder årsak til opphør og om bruker skal varsles.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Mottar annen livsoppholdytelse"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse={andreLivsoppholdytelserVilkår.lovReferanse}
        defaultIsLocked={isSolved}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        lockedContent={
          isSolved ? <VurdertAv ident={vurderAndreLivsoppholdytelserFaktaAP?.ansvarligSaksbehandler} /> : undefined
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
                  dateRange={getDateRangeFromVilkår(andreLivsoppholdytelserVilkår.perioder)}
                />
                <RhfSelect
                  control={formHook.control}
                  name={`perioder.${selectedId}.livsoppholdytelse`}
                  label="Hvilken ytelse mottar bruker?"
                  description={
                    <ReadMore header="Hvilke ytelser kan bruker motta samtidig som aktivitetspenger?" size="small">
                      <BodyShort size="small" spacing>
                        Aktivitetspenger kan som hovedregel ikke mottas samtidig med andre ytelser som skal sikre
                        inntekt til livsopphold. Det gjelder alle livsoppholdsytelser, både i og utenfor Nav.
                      </BodyShort>
                      <BodyShort size="small" spacing>
                        Det finnes noen unntak. Bruker kan motta aktivitetspenger samtidig med:
                      </BodyShort>
                      <List size="small">
                        <List.Item>økonomisk stønad (sosialtjenesteloven § 18 og § 19)</List.Item>
                        <List.Item>sykepenger (folketrygdloven kapittel 8)</List.Item>
                        <List.Item>
                          stønad ved barns eller andre nærståendes sykdom (folketrygdloven kapittel 9)
                        </List.Item>
                      </List>
                    </ReadMore>
                  }
                  readOnly={isFormLocked}
                  validate={[required]}
                  selectValues={ikkeOppfyltÅrsaker.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                />
                {valgtYtelse === AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE && (
                  <RhfTextField
                    control={formHook.control}
                    name={`perioder.${selectedId}.annenLivsoppholdytelse`}
                    label="Skriv inn hvilken ytelse"
                    readOnly={isFormLocked}
                    validate={[required]}
                  />
                )}
                <OpphørKilde
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked}
                  valgtKilde={valgtKilde}
                  kildeOptions={Object.values(AndreLivsoppholdsytelserAvklaringKildeType).map(kilde => ({
                    value: kilde,
                    label: kildeLabels[kilde],
                  }))}
                  kildeAnnetValue={AndreLivsoppholdsytelserAvklaringKildeType.ANNET}
                />
                <OpphørVarsel
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked}
                  skalSendeForhåndsvarsel={skalSendeVarselOmOpphør}
                  skalViseForhåndsvarselTekst={false}
                  forhåndsvarselBeskrivelse="Forklar hvorfor du har satt dato for opphør fordi bruker mottar andre livsoppholdsytelser."
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
