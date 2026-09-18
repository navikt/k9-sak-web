import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { MedlemskapAvslagsÅrsakType } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapAvslagsÅrsakType.js';
import type { MedlemskapPeriodeInfoDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapPeriodeInfoDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyShort, Box, Button, HStack, Label, Radio, ReadMore, Tag, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import type { VilkårSplittPanelPeriod } from '../../shared/vilkårSplittPanel/VilkårSplittPanel';
import { getPeriodStatus, VilkårSplittPanel } from '../../shared/vilkårSplittPanel/VilkårSplittPanel';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';

interface Props {
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => void;
  aksjonspunkt: Pick<AksjonspunktDto, 'definisjon' | 'status'> | undefined;
  behandling: BehandlingDto;
  readOnly: boolean;
  perioder: MedlemskapPeriodeInfoDto[];
  isPermanentlyReadOnly: boolean;
}

export type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<string, Vurdering>;
}

const utfallTilVurdering = (utfall: string): Vurdering => {
  if (utfall === Utfall.OPPFYLT) return 'oppfylt';
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ikkeOppfylt';
  return '';
};

const buildInitialValues = (perioder: MedlemskapPeriodeInfoDto[]): FormData => ({
  vurderinger: Object.fromEntries(perioder.map(r => [r.periode.fom, utfallTilVurdering(r.utfall)])),
});

export const ForutgåendeMedlemskap = ({
  aksjonspunkt,
  api,
  behandling,
  readOnly,
  perioder,
  onAksjonspunktBekreftet,
  isPermanentlyReadOnly,
}: Props) => {
  const isAksjonspunktSolved = aksjonspunkt?.status === AksjonspunktStatus.UTFØRT;
  const sortertePerioder = [...perioder].sort(
    (a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime(),
  );
  const periods: VilkårSplittPanelPeriod[] = sortertePerioder.map((periodeInfo, index) => {
    const nestePeriodeInfo = sortertePerioder[index + 1];
    const visTom = !!nestePeriodeInfo && nestePeriodeInfo.utfall !== Utfall.IKKE_VURDERT;
    return {
      id: periodeInfo.periode.fom,
      status: getPeriodStatus(periodeInfo.utfall),
      label: `${formatDate(periodeInfo.periode.fom)}${visTom ? ` - ${formatDate(periodeInfo.periode.tom)}` : ''}`,
      periode: periodeInfo.periode,
    };
  });

  const [selectedItemId, setSelectedItemId] = useState(
    () =>
      sortertePerioder.find(periodeInfo => periodeInfo.utfall === Utfall.IKKE_VURDERT)?.periode.fom ??
      periods[0]?.id ??
      '',
  );

  useEffect(() => {
    if (!periods.some(period => period.id === selectedItemId)) {
      setSelectedItemId('');
    }
  }, [periods, selectedItemId]);

  const valgtPeriodeInfo = sortertePerioder.find(periodeInfo => periodeInfo.periode.fom === selectedItemId);
  const medlemskapFraBruker = valgtPeriodeInfo?.medlemskapFraBruker;
  const utenlandsopphold = medlemskapFraBruker?.utenlandsopphold ?? [];

  const søknadsopplysninger: { label: string; value: boolean }[] = medlemskapFraBruker
    ? [
        { label: 'Har bodd i Norge', value: medlemskapFraBruker.harBoddINorge },
        ...(medlemskapFraBruker.harJobbetINorge !== null
          ? [{ label: 'Har jobbet i Norge', value: medlemskapFraBruker.harJobbetINorge }]
          : []),
        ...(medlemskapFraBruker.harJobbetUtenforNorge !== null
          ? [{ label: 'Har jobbet utenfor Norge', value: medlemskapFraBruker.harJobbetUtenforNorge }]
          : []),
      ]
    : [];

  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(sortertePerioder),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!aksjonspunkt) {
        return;
      }
      const erVilkarOk = data.vurderinger[selectedItemId] === 'oppfylt';
      const payload = {
        '@type': AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP,
        begrunnelse: erVilkarOk ? 'Forutgående medlemskap er godkjent.' : 'Forutgående medlemskap er ikke godkjent.',
        erVilkarOk,
        avslagsårsak: erVilkarOk ? undefined : MedlemskapAvslagsÅrsakType.SØKER_IKKE_MEDLEM,
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const onSubmit: SubmitHandler<FormData> = data => bekreftAksjonspunktMutation(data);

  if (!aksjonspunkt && !sortertePerioder.some(r => r.utfall !== Utfall.IKKE_VURDERT)) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (sortertePerioder.length === 0) {
    return (
      <Box width="fit-content">
        <Alert variant="info" size="small">
          Ingen perioder å vurdere.
        </Alert>
      </Box>
    );
  }

  return (
    <VilkårSplittPanel
      periods={periods}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      detailHeading="Vurdering av forutgående medlemskap"
      defaultIsLocked={isAksjonspunktSolved}
      readOnly={readOnly}
      isPermanentlyReadOnly={isPermanentlyReadOnly}
    >
      {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => {
        const vurdering = formHook.watch(`vurderinger.${selectedItemId}`);

        return (
          <RhfForm formMethods={formHook} onSubmit={onSubmit}>
            <VStack gap="space-16">
              {!isFormLocked && <ReadMore header="Hvordan går jeg frem?">Veiledning her</ReadMore>}
              {søknadsopplysninger.length > 0 && (
                <VStack gap="space-8">
                  <Label size="small" as="p">
                    Opplysninger fra søknaden
                  </Label>
                  <VStack gap="space-4">
                    {søknadsopplysninger.map(opplysning => (
                      <BodyShort size="small" key={opplysning.label}>
                        {`${opplysning.label}: ${opplysning.value ? 'Ja' : 'Nei'}`}
                      </BodyShort>
                    ))}
                  </VStack>
                </VStack>
              )}
              {utenlandsopphold.length > 0 && (
                <VStack gap="space-8">
                  <Label size="small" as="p">
                    Utenlandsopphold siste 5 år
                  </Label>
                  <VStack gap="space-12">
                    {utenlandsopphold.map(medlemskap => {
                      if (!medlemskap.periode) {
                        return null;
                      }
                      const formatertPeriode = `${formatDate(medlemskap.periode.fom)} - ${formatDate(medlemskap.periode.tom)}`;
                      return (
                        <VStack gap="space-2" key={`${medlemskap.land}_${formatertPeriode}`}>
                          <HStack gap="space-8" align="center">
                            <BodyShort size="small">
                              {`${medlemskap.land ?? ''}${medlemskap.landkode ? ` (${medlemskap.landkode})` : ''}: ${formatertPeriode}`}
                            </BodyShort>
                            {medlemskap.harTrygdeavtale ? (
                              <Tag variant="outline" data-color="success" size="small">
                                EØS
                              </Tag>
                            ) : (
                              <Tag variant="outline" data-color="danger" size="small">
                                IKKE-EØS
                              </Tag>
                            )}
                          </HStack>
                          {medlemskap.harJobbetIPerioden !== null && (
                            <BodyShort size="small">
                              {`Har jobbet i perioden: ${medlemskap.harJobbetIPerioden ? 'Ja' : 'Nei'}`}
                            </BodyShort>
                          )}
                          {medlemskap.utenlandskNasjonalId && (
                            <BodyShort size="small">{`Utenlandsk nasjonal id: ${medlemskap.utenlandskNasjonalId}`}</BodyShort>
                          )}
                        </VStack>
                      );
                    })}
                  </VStack>
                </VStack>
              )}
              {isFormLocked && vurdering ? (
                <VStack gap="space-8">
                  <Label size="small" as="p">
                    Har søker forutgående medlemskap
                  </Label>
                  <BodyShort size="small">{vurdering === 'oppfylt' ? 'Ja' : 'Nei'}</BodyShort>
                </VStack>
              ) : (
                <RhfRadioGroup
                  key={selectedItemId}
                  control={formHook.control}
                  name={`vurderinger.${selectedItemId}`}
                  legend="Har søker forutgående medlemskap"
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value="oppfylt">Ja</Radio>
                  <Radio value="ikkeOppfylt">Nei</Radio>
                </RhfRadioGroup>
              )}
              {!isFormLocked && (
                <HStack gap="space-8">
                  <Button type="submit" size="small" loading={isPending}>
                    Bekreft og fortsett
                  </Button>
                  <Button size="small" variant="tertiary" type="button" onClick={() => setIsFormLocked(true)}>
                    Avbryt
                  </Button>
                </HStack>
              )}
            </VStack>
          </RhfForm>
        );
      }}
    </VilkårSplittPanel>
  );
};
