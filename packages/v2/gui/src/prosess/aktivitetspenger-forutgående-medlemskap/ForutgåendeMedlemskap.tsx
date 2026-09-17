import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { MedlemskapAvslagsÅrsakType } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapAvslagsÅrsakType.js';
import type { MedlemskapPeriodeResultatDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapPeriodeResultatDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyShort, Box, Button, HGrid, HStack, Label, Radio, ReadMore, VStack } from '@navikt/ds-react';
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
  resultater: MedlemskapPeriodeResultatDto[];
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

const buildInitialValues = (resultater: MedlemskapPeriodeResultatDto[]): FormData => ({
  vurderinger: Object.fromEntries(resultater.map(r => [r.periode.fom, utfallTilVurdering(r.utfall)])),
});

export const ForutgåendeMedlemskap = ({
  aksjonspunkt,
  api,
  behandling,
  readOnly,
  resultater,
  onAksjonspunktBekreftet,
  isPermanentlyReadOnly,
}: Props) => {
  const isAksjonspunktSolved = aksjonspunkt?.status === AksjonspunktStatus.UTFØRT;
  const sorterteResultater = [...resultater].sort(
    (a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime(),
  );
  const periods: VilkårSplittPanelPeriod[] = sorterteResultater.map((resultat, index) => {
    const nesteResultat = sorterteResultater[index + 1];
    const visTom = !!nesteResultat && nesteResultat.utfall !== Utfall.IKKE_VURDERT;
    return {
      id: resultat.periode.fom,
      status: getPeriodStatus(resultat.utfall),
      label: `${formatDate(resultat.periode.fom)}${visTom ? ` - ${formatDate(resultat.periode.tom)}` : ''}`,
      periode: resultat.periode,
    };
  });

  const [selectedItemId, setSelectedItemId] = useState(
    () =>
      sorterteResultater.find(resultat => resultat.utfall === Utfall.IKKE_VURDERT)?.periode.fom ?? periods[0]?.id ?? '',
  );

  useEffect(() => {
    if (!periods.some(period => period.id === selectedItemId)) {
      setSelectedItemId('');
    }
  }, [periods, selectedItemId]);

  const valgtResultat = sorterteResultater.find(resultat => resultat.periode.fom === selectedItemId);
  const utenlandsopphold = valgtResultat?.medlemskapFraBruker?.utenlandsopphold ?? [];

  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(sorterteResultater),
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

  if (!aksjonspunkt && !sorterteResultater.some(r => r.utfall !== Utfall.IKKE_VURDERT)) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (sorterteResultater.length === 0) {
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
      detailHeading="Forutgående medlemskap"
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
              {utenlandsopphold.length > 0 && (
                <VStack gap="space-8">
                  <Label size="small" as="p">
                    Utenlandsopphold siste 5 år
                  </Label>
                  <HGrid columns="max-content" gap="space-8" align="center">
                    {utenlandsopphold.map(medlemskap => {
                      if (!medlemskap.periode) {
                        return null;
                      }
                      const formatertPeriode = `${formatDate(medlemskap.periode.fom)} - ${formatDate(medlemskap.periode.tom)}`;
                      return (
                        <BodyShort size="small" key={`${medlemskap.land}_${formatertPeriode}`}>
                          {`${medlemskap.land}: ${formatertPeriode}`}
                        </BodyShort>
                      );
                    })}
                  </HGrid>
                </VStack>
              )}
              {isFormLocked && vurdering ? (
                <VStack gap="space-8">
                  <Label size="small" as="p">
                    Er forutgående medlemskap godkjent?
                  </Label>
                  <BodyShort size="small">{vurdering === 'oppfylt' ? 'Ja' : 'Nei'}</BodyShort>
                </VStack>
              ) : (
                <RhfRadioGroup
                  key={selectedItemId}
                  control={formHook.control}
                  name={`vurderinger.${selectedItemId}`}
                  legend="Er forutgående medlemskap godkjent?"
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
