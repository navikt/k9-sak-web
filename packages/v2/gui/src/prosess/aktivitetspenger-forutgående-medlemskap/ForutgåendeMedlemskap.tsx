import type { UngSakVilkårMedPerioderDto } from '@k9-sak-web/backend/combined/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { MedlemskapAvslagsÅrsakType } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapAvslagsÅrsakType.js';
import type { MedlemskapsPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapsPeriodeDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyShort, Box, Button, HGrid, HStack, Label, Radio, ReadMore, Tag, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { Fragment, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import type { VilkårSplittPanelItem } from '../aktivitetspenger-inngangsvilkår/VilkårSplittPanel';
import { getItemStatus, VilkårSplittPanel } from '../aktivitetspenger-inngangsvilkår/VilkårSplittPanel';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';

interface Props {
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => void;
  aksjonspunkt: Pick<AksjonspunktDto, 'definisjon' | 'status'> | undefined;
  behandling: BehandlingDto;
  readOnly: boolean;
  forutgåendeMedlemskap: MedlemskapsPeriodeDto[];
  vilkår: UngSakVilkårMedPerioderDto;
}

type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<string, Vurdering>;
}

const utfallTilVurdering = (utfall: string): Vurdering => {
  if (utfall === Utfall.OPPFYLT) return 'oppfylt';
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ikkeOppfylt';
  return '';
};

const buildInitialValues = (vilkår: UngSakVilkårMedPerioderDto): FormData => ({
  vurderinger: Object.fromEntries(
    (vilkår.perioder ?? []).map(p => [p.periode.fom, utfallTilVurdering(p.vilkarStatus)]),
  ),
});

export const ForutgåendeMedlemskap = ({
  aksjonspunkt,
  api,
  behandling,
  readOnly,
  vilkår,
  forutgåendeMedlemskap,
  onAksjonspunktBekreftet,
}: Props) => {
  const isAksjonspunktSolved = aksjonspunkt?.status === AksjonspunktStatus.UTFØRT;
  const items: VilkårSplittPanelItem[] = (vilkår.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}`,
    periode: p.periode,
  }));

  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id ?? '');

  const selectedPeriode = vilkår.perioder?.find(p => p.periode.fom === selectedItemId)?.periode;
  const overlappendeMedlemskap = selectedPeriode
    ? forutgåendeMedlemskap.filter(
        m => m.periode && m.periode.fom <= selectedPeriode.tom && m.periode.tom >= selectedPeriode.fom,
      )
    : [];

  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(vilkår),
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

  if (!aksjonspunkt && !vilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (vilkår.perioder?.every(p => p.vilkarStatus === Utfall.IKKE_RELEVANT)) {
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
      items={items}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      detailHeading="Forutgående medlemskap"
      defaultIsLocked={isAksjonspunktSolved}
      readOnly={readOnly}
    >
      {(defaultIsLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => (
        <RhfForm formMethods={formHook} onSubmit={onSubmit}>
          <VStack gap="space-16">
            {!defaultIsLocked && <ReadMore header="Hvordan går jeg frem?">Veiledning her</ReadMore>}
            {overlappendeMedlemskap.length > 0 && (
              <VStack gap="space-8">
                <Label size="small" as="p">
                  Bosteder i utlandet siste 5 år
                </Label>
                <HGrid columns="max-content max-content" gap="space-8" align="center">
                  {overlappendeMedlemskap.map(medlemskap => {
                    if (!medlemskap.periode) {
                      return null;
                    }
                    const formatertPeriode = `${formatDate(medlemskap.periode.fom)} - ${formatDate(medlemskap.periode.tom)}`;
                    return (
                      <Fragment key={`${medlemskap.land}_${formatertPeriode}`}>
                        <BodyShort size="small">{`${medlemskap.land}: ${formatertPeriode}`}</BodyShort>
                        {medlemskap.harTrygdeavtale ? (
                          <Tag variant="outline" data-color="success" size="small">
                            Innenfor EØS
                          </Tag>
                        ) : (
                          <Tag variant="outline" data-color="danger" size="small">
                            Utenfor EØS
                          </Tag>
                        )}
                      </Fragment>
                    );
                  })}
                </HGrid>
              </VStack>
            )}
            <RhfRadioGroup
              key={selectedItemId}
              control={formHook.control}
              name={`vurderinger.${selectedItemId}`}
              legend="Er forutgående medlemskap godkjent?"
              validate={[required]}
              readOnly={defaultIsLocked}
            >
              <Radio value="oppfylt">Ja</Radio>
              <Radio value="ikkeOppfylt">Nei</Radio>
            </RhfRadioGroup>
            {!defaultIsLocked && (
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
      )}
    </VilkårSplittPanel>
  );
};
