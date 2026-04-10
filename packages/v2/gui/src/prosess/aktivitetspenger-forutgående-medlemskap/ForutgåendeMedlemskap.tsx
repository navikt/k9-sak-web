import type { UngSakVilkårMedPerioderDto } from '@k9-sak-web/backend/combined/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { MedlemskapsPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapsPeriodeDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, Button, HGrid, Label, Radio, ReadMore, Tag, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { VilkårSplittPanelItem } from '../aktivitetspenger-inngangsvilkår/VilkårSplittPanel';
import { VilkårSplittPanel } from '../aktivitetspenger-inngangsvilkår/VilkårSplittPanel';

interface Props {
  submitCallback: (
    data: Array<{ kode: AksjonspunktDto['definisjon']; begrunnelse: string; erVilkarOk: boolean }>,
    aksjonspunkt: Array<Pick<AksjonspunktDto, 'definisjon'>>,
  ) => Promise<unknown>;
  aksjonspunkt: Pick<AksjonspunktDto, 'definisjon'> | undefined;
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

const getItemStatus = (status: string): VilkårSplittPanelItem['status'] => {
  if (status === Utfall.OPPFYLT) return 'success';
  if (status === Utfall.IKKE_OPPFYLT) return 'error';
  return 'warning';
};

export const ForutgåendeMedlemskap = ({
  submitCallback,
  aksjonspunkt,
  readOnly,
  vilkår,
  forutgåendeMedlemskap,
}: Props) => {
  const items: VilkårSplittPanelItem[] = (vilkår.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}`,
  }));

  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id ?? '');

  const selectedPeriode = vilkår.perioder?.find(p => p.periode.fom === selectedItemId)?.periode;
  const overlappendeMedlemskap = selectedPeriode
    ? forutgåendeMedlemskap.filter(
        m => m.periode && m.periode.fom <= selectedPeriode.tom && m.periode.tom >= selectedPeriode.fom,
      )
    : [];

  const formMethods = useForm<FormData>({
    defaultValues: buildInitialValues(vilkår),
  });

  const onSubmit = async (data: FormData) => {
    if (!aksjonspunkt) {
      return;
    }
    const erVilkarOk = data.vurderinger[selectedItemId] === 'oppfylt';
    const payload = {
      kode: aksjonspunkt.definisjon,
      begrunnelse: erVilkarOk ? 'Forutgående medlemskap er godkjent.' : 'Forutgående medlemskap er ikke godkjent.',
      erVilkarOk,
      avslagsårsak: erVilkarOk ? undefined : 'SØKER_IKKE_MEDLEM',
    };
    await submitCallback([payload], [aksjonspunkt]);
  };

  return (
    <VilkårSplittPanel
      items={items}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      detailHeading="Forutgående medlemskap"
    >
      <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
        <VStack gap="space-16">
          <ReadMore header="Hvordan går jeg frem?">Veiledning her</ReadMore>
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
            control={formMethods.control}
            name={`vurderinger.${selectedItemId}`}
            legend="Er forutgående medlemskap godkjent?"
            validate={[required]}
            disabled={readOnly}
          >
            <Radio value="oppfylt">Ja</Radio>
            <Radio value="ikkeOppfylt">Nei</Radio>
          </RhfRadioGroup>
          <Box>
            <Button type="submit" size="small" disabled={readOnly} loading={formMethods.formState.isSubmitting}>
              Bekreft og fortsett
            </Button>
          </Box>
        </VStack>
      </RhfForm>
    </VilkårSplittPanel>
  );
};
