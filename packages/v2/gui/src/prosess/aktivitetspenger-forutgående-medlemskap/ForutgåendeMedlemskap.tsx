import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { MedlemskapsPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapsPeriodeDto.js';
import { Box, Button, Heading, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  submitCallback: (
    data: Array<{ kode: AksjonspunktDto['definisjon']; begrunnelse: string; erVilkarOk: boolean }>,
    aksjonspunkt: Array<Pick<AksjonspunktDto, 'definisjon'>>,
  ) => Promise<unknown>;
  aksjonspunkt: Pick<AksjonspunktDto, 'definisjon'>;
  readOnly: boolean;
  forutgåendeMedlemskap: MedlemskapsPeriodeDto[];
}

interface FormData {
  erGodkjent: string;
}

export const ForutgåendeMedlemskap = ({ submitCallback, aksjonspunkt, readOnly }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<FormData>({
    defaultValues: {
      erGodkjent: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const erVilkarOk = data.erGodkjent === 'true';
    const payload = {
      kode: aksjonspunkt.definisjon,
      begrunnelse: erVilkarOk ? 'Forutgående medlemskap er godkjent.' : 'Forutgående medlemskap er ikke godkjent.',
      erVilkarOk,
    };
    try {
      await submitCallback([payload], [aksjonspunkt]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box width="fit-content">
      <Heading size="medium" level="1" spacing>
        Medlemskap
      </Heading>

      <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
        <VStack gap="space-16">
          <ReadMore header="Hvordan går jeg frem?">Veiledning her</ReadMore>
          <RhfRadioGroup
            control={formMethods.control}
            name="erGodkjent"
            legend="Er forutgående medlemskap godkjent?"
            validate={[required]}
            disabled={readOnly}
          >
            <Radio value="true">Ja</Radio>
            <Radio value="false">Nei</Radio>
          </RhfRadioGroup>
          <Button type="submit" size="small" disabled={readOnly} loading={isSubmitting}>
            Bekreft og fortsett
          </Button>
        </VStack>
      </RhfForm>
    </Box>
  );
};
