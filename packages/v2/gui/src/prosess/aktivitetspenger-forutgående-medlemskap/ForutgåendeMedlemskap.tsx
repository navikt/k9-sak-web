import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { Button, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';

interface Props {
  submitCallback: (data: any, aksjonspunkt: AksjonspunktDto[]) => Promise<any>;
  aksjonspunkt: Pick<AksjonspunktDto, 'definisjon'>;
  readOnly: boolean;
}

interface FormData {
  erGodkjent: string;
}

export const ForutgåendeMedlemskap = ({ submitCallback, aksjonspunkt, readOnly }: Props) => {
  const formMethods = useForm<FormData>({
    defaultValues: {
      erGodkjent: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const erGodkjent = data.erGodkjent === 'true';
    const aksjonspunktKode = aksjonspunkt.definisjon ?? '';
    const payload = {
      kode: aksjonspunktKode,
      begrunnelse: erGodkjent ? 'Forutgående medlemskap er godkjent.' : 'Forutgående medlemskap er ikke godkjent.',
      erGodkjent,
    };

    await submitCallback([payload], [aksjonspunkt]);
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
      <VStack gap="space-24">
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
        <Button type="submit" size="small" disabled={readOnly}>
          Bekreft og fortsett
        </Button>
      </VStack>
    </RhfForm>
  );
};
