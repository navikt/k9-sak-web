import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { RettVedDødType } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/RettVedDødType.js';
import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import { Alert, Box, Button, HStack, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import type { BekreftRettVedDødAksjonspunkt } from './BekreftRettVedDødAksjonspunkt.js';
import { rett12UkerTekst, rett6UkerTekst } from './rettVedDødUtfallTekst.js';

const VURDERING_MAKS_LENGDE = 4096;
const maxLength4096 = maxLength(VURDERING_MAKS_LENGDE);

interface RettVedDødFormValues {
  vurdering: string;
  rettVedDødType?: RettVedDødType;
}

interface RettVedDødFormProps {
  rettVedDød: VurderingRettPleiepengerVedDødDto | null;
  submittable: boolean;
  onSubmit: (aksjonspunkt: BekreftRettVedDødAksjonspunkt) => Promise<void>;
  onCancel: () => void;
}

export const RettVedDødForm = ({ rettVedDød, submittable, onSubmit, onCancel }: RettVedDødFormProps) => {
  const formMethods = useForm<RettVedDødFormValues>({
    defaultValues: {
      vurdering: rettVedDød?.vurdering ?? '',
      rettVedDødType: rettVedDød?.rettVedDødType,
    },
  });
  const { isSubmitting } = formMethods.formState;

  const handleSubmit = async ({ vurdering, rettVedDødType }: RettVedDødFormValues) => {
    if (!rettVedDødType) {
      return;
    }
    await onSubmit({
      kode: AksjonspunktDefinisjon.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD,
      begrunnelse: 'Rett etter pleietrengendes død er behandlet',
      vurdering,
      rettVedDødType,
    });
  };

  const handleCancel = () => {
    formMethods.reset();
    onCancel();
  };

  return (
    <Box borderWidth="2" borderColor="warning" padding="space-20" maxWidth="64rem">
      <VStack gap="space-24">
        <Alert variant="warning">Vurder hvor lang periode søker har rett på pleiepenger ved barnets død.</Alert>
        <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
          <VStack gap="space-24">
            <RhfRadioGroup
              control={formMethods.control}
              name="rettVedDødType"
              legend="Vurder hvor lang periode søker har rett på pleiepenger ved barnets død."
              hideLegend
              size="small"
              validate={[required]}
            >
              <Radio value={RettVedDødType.RETT_6_UKER}>{rett6UkerTekst}</Radio>
              <Radio value={RettVedDødType.RETT_12_UKER}>{rett12UkerTekst}</Radio>
            </RhfRadioGroup>
            <div className="max-w-xl">
              <RhfTextarea
                control={formMethods.control}
                name="vurdering"
                label="Vurdering"
                size="small"
                maxLength={VURDERING_MAKS_LENGDE}
                validate={[required, maxLength4096, hasValidText]}
              />
            </div>
            <HStack gap="space-16">
              <Button size="small" loading={isSubmitting} disabled={isSubmitting || !submittable}>
                Bekreft og fortsett
              </Button>
              <Button size="small" variant="secondary" type="button" disabled={isSubmitting} onClick={handleCancel}>
                Avbryt
              </Button>
            </HStack>
          </VStack>
        </RhfForm>
      </VStack>
    </Box>
  );
};
