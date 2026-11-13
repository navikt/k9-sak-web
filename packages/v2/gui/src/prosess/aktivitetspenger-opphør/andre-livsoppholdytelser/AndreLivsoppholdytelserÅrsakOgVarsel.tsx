import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { AndreLivsoppholdsytelserAvklaringKildeType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserAvklaringKildeType.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Avklaringtype } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avklaringtype.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { VilkårsavklaringerDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import { ExclamationmarkTriangleFillIcon, InformationSquareFillIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Button, HStack, InfoCard, Link, List, ReadMore, VStack } from '@navikt/ds-react';
import { RhfForm, RhfSelect, RhfTextField } from '@navikt/ft-form-hooks';
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
import { andreLivsoppholdsytelserIkkeOppfyltÅrsaker } from '../../aktivitetspenger-felles/andreLivsoppholdsytelserIkkeOppfyltÅrsaker.js';
import { vilkårsavklaringerQueryOptions } from '../../aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { OpphørAvslagValg, getDateRangeFromVilkår } from '../formfields/OpphørAvslagValg.js';
import { OpphørForhåndsvarselModal } from '../formfields/OpphørForhåndsvarselModal.js';
import { OpphørKilde } from '../formfields/OpphørKilde.js';
import { getOpphørPeriods } from '../formfields/OpphørPerioder.js';
import { OpphørVarsel } from '../formfields/OpphørVarsel.js';
import type { OpphørVarselPeriodForm } from '../formfields/OpphørVarselFormData.js';
import type { OpphørÅrsakOgVarselProps } from '../types.js';

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

const buildInitialValues = (vilkårsavklaringer: VilkårsavklaringerDto): AndreLivsoppholdytelserFormData => ({
  perioder: Object.fromEntries(
    vilkårsavklaringer.perioder.map(({ periode, avklaring }) => {
      const isOpphør = avklaring?.avklaringtype === Avklaringtype.OPPHØR;
      return [
        periode.fom,
        {
          avslagFom: avklaring?.periode.fom ?? periode.fom,
          avslagTom: avklaring ? (avklaring.periode.tom ?? '') : (periode.tom ?? ''),
          begrunnelseForIkkeVarsle: avklaring?.begrunnelseIkkeVarsel ?? '',
          kilde: avklaring?.kilde ?? '',
          kildeFritekst: avklaring?.kildeFritekst ?? '',
          livsoppholdytelse: avklaring?.ikkeOppfyltÅrsak ?? '',
          opphøreEllerAvslå: avklaring ? (isOpphør ? 'opphøre' : 'avslå') : '',
          opphørsdato: avklaring?.periode.fom ?? periode.fom,
          skalSendeVarselOmOpphør:
            avklaring?.skalSendeVarsel === undefined ? '' : avklaring.skalSendeVarsel ? 'ja' : 'nei',
          annenLivsoppholdytelse:
            avklaring?.ikkeOppfyltÅrsak === AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE
              ? (avklaring.fritekstTilVarsel ?? '')
              : '',
        },
      ];
    }),
  ),
});

interface SubmitArgs {
  formData: AndreLivsoppholdytelserFormData;
  selectedId: string;
}

const buildPayload = ({ formData, selectedId }: SubmitArgs) => {
  const selectedPeriod = formData.perioder[selectedId];
  if (!selectedPeriod) throw new Error('Kunne ikke finne valgt periode for andre livsoppholdsytelser');
  const isOpphør = selectedPeriod.opphøreEllerAvslå === 'opphøre';
  const skalSendeVarsel = selectedPeriod.skalSendeVarselOmOpphør === 'ja';
  const avklaring = {
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
  };
  const avklaringer: [typeof avklaring] = [avklaring];
  return {
    '@type': AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER,
    begrunnelse: 'Løser aksjonspunkt VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER',
    avklaringer,
  };
};

export const AndreLivsoppholdytelserÅrsakOgVarsel = ({
  vurderFaktaAP,
  vilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: OpphørÅrsakOgVarselProps) => {
  const queryClient = useQueryClient();
  const vilkårsavklaringerOptions = vilkårsavklaringerQueryOptions(
    api,
    behandling,
    vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  );
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
  const formHook = useForm<AndreLivsoppholdytelserFormData>({
    defaultValues: buildInitialValues(vilkårsavklaringer),
  });
  const formPerioder = formHook.watch('perioder');
  const valgtFormPeriode = formPerioder[selectedId];
  const valgtOpphørPeriode = opphørPeriods.find(periode => periode.id === selectedId);
  const valgtVilkårsavklaringPeriode = vilkårsavklaringer.perioder.find(p => p.periode.fom === selectedId);
  const opphøreEllerAvslå = valgtFormPeriode?.opphøreEllerAvslå ?? '';
  const valgtKilde = valgtFormPeriode?.kilde ?? '';
  const skalSendeVarselOmOpphør = valgtFormPeriode?.skalSendeVarselOmOpphør ?? '';
  const valgtYtelse = valgtFormPeriode?.livsoppholdytelse ?? '';
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
    data: AndreLivsoppholdytelserFormData,
    setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const skalSendeForhåndsvarsel = skalSendeVarselOmOpphør === 'ja';
    const submitArgs = { formData: data, selectedId };
    if (skalSendeForhåndsvarsel) {
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
        detailHeading="Mottar annen livsoppholdytelse"
        periodListLabel="Alle perioder"
        periodColumnHeader="Dato/periode"
        lovreferanse="§ 4"
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
              <VStack gap="space-24" maxWidth="78ch" width="100%">
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
                  name={`perioder.${selectedId}.livsoppholdytelse`}
                  label="Hvilken ytelse mottar bruker?"
                  description={
                    <ReadMore size="small" header="Hvilke ytelser kan bruker motta samtidig som aktivitetspenger?">
                      <VStack gap="space-20">
                        <BodyLong size="small">
                          Aktivitetspenger kan som hovedregel ikke mottas samtidig med andre ytelser som skal sikre
                          inntekt til livsopphold. Det gjelder alle livsoppholdsytelser, både i og utenfor Nav.
                        </BodyLong>
                        <VStack gap="space-8">
                          <BodyShort size="small">
                            Det finnes noen unntak. Bruker kan motta aktivitetspenger samtidig med:
                          </BodyShort>
                          <List size="small">
                            <List.Item>
                              økonomisk stønad (
                              <Link
                                href="https://lovdata.no/pro/#document/NL/lov/2009-12-18-131/%C2%A718"
                                target="_blank"
                              >
                                sosialtjenesteloven § 18
                              </Link>{' '}
                              og{' '}
                              <Link
                                href="https://lovdata.no/pro/#document/NL/lov/2009-12-18-131/%C2%A719"
                                target="_blank"
                              >
                                § 19
                              </Link>
                              )
                            </List.Item>
                            <List.Item>
                              stønad ved barns eller andre nærståendes sykdom (
                              <Link href="https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/kap9" target="_blank">
                                folketrygdloven kapittel 9
                              </Link>
                              )
                            </List.Item>
                            <List.Item>
                              lån og stipend til utdanning (
                              <Link href="https://lovdata.no/pro/#document/SF/forskrift/2020-04-15-798" target="_blank">
                                forskrift om utdanningsstøtte
                              </Link>
                              )
                            </List.Item>
                          </List>
                        </VStack>
                        <BodyLong size="small">
                          Et medlem som allerede mottar sykepenger på tidspunktet hen setter fram krav om
                          aktivitetspenger, skal først benytte retten til sykepenger fullt ut.
                        </BodyLong>
                        <BodyLong size="small">
                          Mottak av stønad ved barns og andre nærståendes sykdom vil føre til reduksjon av
                          aktivitetspenger, se §&nbsp;14. Det samme vil skje hvis en person har tjent opp rett til
                          sykepenger etter oppstart med aktivitetspenger.
                        </BodyLong>
                      </VStack>
                    </ReadMore>
                  }
                  readOnly={isFormLocked || isPending}
                  validate={[required]}
                  selectValues={andreLivsoppholdsytelserIkkeOppfyltÅrsaker.map(option => (
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
                    readOnly={isFormLocked || isPending}
                    validate={[required]}
                  />
                )}
                <OpphørKilde
                  control={formHook.control}
                  selectedId={selectedId}
                  isFormLocked={isFormLocked || isPending}
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
                  isFormLocked={isFormLocked || isPending}
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
