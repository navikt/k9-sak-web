import {
  ung_kodeverk_behandling_BehandlingResultatType as BehandlingDtoBehandlingResultatType,
  ung_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  type ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { FileSearchIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Fieldset, HStack, Label, VStack } from '@navikt/ds-react';
import { CheckboxField, Form } from '@navikt/ft-form-hooks';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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
  const behandlingErInnvilget = behandling.behandlingsresultat?.type === BehandlingDtoBehandlingResultatType.INNVILGET;
  const behandlingErAvslått = behandling.behandlingsresultat?.type === BehandlingDtoBehandlingResultatType.AVSLÅTT;
  const harAksjonspunkt = aksjonspunkter.some(ap => ap.kanLoses);
  const harAksjonspunktMedTotrinnsbehandling = aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling);
  const redigerAutomatiskBrev = useWatch({ control: formMethods.control, name: 'redigerAutomatiskBrev' });
  const hindreUtsendingAvBrev = useWatch({ control: formMethods.control, name: 'hindreUtsendingAvBrev' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const behandlingErAvsluttet = behandling.status === BehandlingDtoStatus.AVSLUTTET;

  const { refetch, isLoading: forhåndsvisningIsLoading } = useQuery({
    queryKey: ['forhandsvisVedtaksbrev', behandling.id],
    queryFn: async () => {
      const response = await api.forhåndsvisVedtaksbrev(behandling.id);
      // Create a URL object from the PDF blob
      const fileURL = window.URL.createObjectURL(response);
      // Open the PDF in a new tab
      window.open(fileURL, '_blank');
      return response;
    },
    enabled: false,
  });

  const { data: vedtaksbrevValg, isLoading: vedtaksbrevValgIsLoading } = useQuery({
    queryKey: ['vedtaksbrevValg', behandling.id],
    queryFn: async () => {
      const response = await api.vedtaksbrevValg(behandling.id);
      return response;
    },
  });

  const transformValues = () => aksjonspunkter.filter(ap => ap.kanLoses).map(ap => ({ kode: ap.definisjon }));
  const handleSubmit = () => {
    setIsSubmitting(true);
    void submitCallback(transformValues()).finally(() => {
      setIsSubmitting(false);
    });
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
                {behandlingErInnvilget ? 'Ungdomsprogramytelse er innvilget' : 'Ungdomsprogramytelse er opphørt'}
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
              {vedtaksbrevValg?.harBrev && (
                <Button
                  variant="tertiary"
                  onClick={() => refetch()}
                  size="small"
                  icon={<FileSearchIcon aria-hidden fontSize="1.5rem" />}
                  loading={forhåndsvisningIsLoading}
                  type="button"
                  disabled={vedtaksbrevValgIsLoading}
                >
                  Forhåndsvis brev
                </Button>
              )}
            </div>
            {harAksjonspunkt && !readOnly && (
              <div>
                <Button type="submit" variant="primary" size="small" loading={isSubmitting}>
                  {harAksjonspunktMedTotrinnsbehandling ? 'Send til beslutter' : 'Fatt vedtak'}
                </Button>
              </div>
            )}
          </VStack>
          {!behandlingErAvsluttet && (
            <div className={styles.brevCheckboxContainer}>
              <Fieldset legend="Valg for brev" size="small">
                <div>
                  {vedtaksbrevValg?.kanOverstyreRediger && (
                    <CheckboxField
                      name="redigerAutomatiskBrev"
                      label="Rediger automatisk brev"
                      disabled={!vedtaksbrevValg.enableRediger || hindreUtsendingAvBrev || readOnly}
                    />
                  )}
                  {vedtaksbrevValg?.kanOverstyreHindre && (
                    <CheckboxField
                      name="hindreUtsendingAvBrev"
                      label="Hindre utsending av brev"
                      disabled={!vedtaksbrevValg.enableHindre || redigerAutomatiskBrev || readOnly}
                    />
                  )}
                </div>
              </Fieldset>
            </div>
          )}
        </HStack>
      </Box>
    </Form>
  );
};
