import {
  behandlingResultatType,
  type AksjonspunktDto,
  type ForhåndsvisVedtaksbrevResponse,
} from '@k9-sak-web/backend/ungsak/generated';
import { FileSearchIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Fieldset, HStack, Label, VStack } from '@navikt/ds-react';
import { CheckboxField, Form } from '@navikt/ft-form-hooks';
import { useQuery } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import AvslagsårsakListe from './AvslagsårsakListe';
import styles from './ungVedtak.module.css';
import type { UngVedtakBackendApiType } from './UngVedtakBackendApiType';
import type { UngVedtakBehandlingDto } from './UngVedtakBehandlingDto';
import type { UngVedtakVilkårDto } from './UngVedtakVilkårDto';

interface UngVedtakProps {
  aksjonspunkter: AksjonspunktDto[];
  api: UngVedtakBackendApiType;
  behandling: UngVedtakBehandlingDto;
  submitCallback: (data: any) => Promise<any>;
  vilkår: UngVedtakVilkårDto[];
  readOnly: boolean;
}

const buildInitialValues = () => ({
  redigerAutomatiskBrev: false,
  hindreUtsendingAvBrev: false,
});

interface FormData {
  redigerAutomatiskBrev: boolean;
  hindreUtsendingAvBrev: boolean;
}

export const UngVedtak = ({ api, behandling, aksjonspunkter, submitCallback, vilkår, readOnly }: UngVedtakProps) => {
  const formMethods = useForm<FormData>({
    defaultValues: buildInitialValues(),
  });
  const behandlingErInnvilget = behandling.behandlingsresultat?.type === behandlingResultatType.INNVILGET;
  const behandlingErAvslått = behandling.behandlingsresultat?.type === behandlingResultatType.AVSLÅTT;
  const harAksjonspunkt = aksjonspunkter.filter(ap => ap.kanLoses).length > 0;
  const redigerAutomatiskBrev = useWatch({ control: formMethods.control, name: 'redigerAutomatiskBrev' });
  const hindreUtsendingAvBrev = useWatch({ control: formMethods.control, name: 'hindreUtsendingAvBrev' });

  const { refetch, isLoading: forhåndsvisningIsLoading } = useQuery({
    queryKey: ['forhandsvisVedtaksbrev', behandling.id],
    queryFn: () =>
      api.forhåndsvisVedtaksbrev(behandling.id).then((response: ForhåndsvisVedtaksbrevResponse) => {
        // Create a URL object from the PDF blob
        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

        // Open the PDF in a new tab
        window.open(fileURL, '_blank');
      }),
    enabled: false,
  });

  const transformValues = () => aksjonspunkter.filter(ap => ap.kanLoses).map(ap => ({ kode: ap.definisjon }));
  const handleSubmit = () => {
    submitCallback(transformValues());
  };

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <Box marginBlock="4">
        <HStack justify="space-between">
          <VStack gap="4">
            <div>
              <Label size="small" as="p">
                Resultat
              </Label>
              <BodyShort size="small">
                {behandlingErInnvilget ? 'Ungdomsytelse er innvilget' : 'Ungdomsytelse er avslått'}
              </BodyShort>
            </div>
            {behandlingErAvslått && (
              <div>
                <Label size="small" as="p">
                  Årsak til avslag
                </Label>
                <AvslagsårsakListe vilkår={vilkår} />
              </div>
            )}
            <div>
              <Button
                variant="tertiary"
                onClick={() => refetch()}
                size="small"
                icon={<FileSearchIcon aria-hidden fontSize="1.5rem" />}
                loading={forhåndsvisningIsLoading}
              >
                Forhåndsvis brev
              </Button>
            </div>
            {harAksjonspunkt && (
              <div>
                <Button type="submit" variant="primary" size="small">
                  Fatt vedtak
                </Button>
              </div>
            )}
          </VStack>
          <div className={styles.brevCheckboxContainer}>
            <Fieldset legend="Valg for brev" size="small">
              <div>
                <CheckboxField
                  name="redigerAutomatiskBrev"
                  label="Rediger automatisk brev"
                  disabled={hindreUtsendingAvBrev || readOnly}
                />
                <CheckboxField
                  name="hindreUtsendingAvBrev"
                  label="Hindre utsending av brev"
                  disabled={redigerAutomatiskBrev || readOnly}
                />
              </div>
            </Fieldset>
          </div>
        </HStack>
      </Box>
    </Form>
  );
};
