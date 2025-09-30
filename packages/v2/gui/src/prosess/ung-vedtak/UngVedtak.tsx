import {
  ung_kodeverk_behandling_BehandlingResultatType as BehandlingDtoBehandlingResultatType,
  ung_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  ung_kodeverk_dokument_DokumentMalType as DokumentMalType,
  type ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  type ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgResponse as VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FileSearchIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Fieldset, HStack, Label, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm } from '@navikt/ft-form-hooks';
import { useMutation, useQuery, type QueryObserverResult, type RefetchOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import AvslagsårsakListe from './AvslagsårsakListe';
import { FritekstBrevpanel } from './brev/FritekstBrevpanel';
import type { FormData } from './FormData';
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
  vedtaksbrevValgResponse: VedtaksbrevValgResponse | undefined;
  refetchVedtaksbrevValg: (options?: RefetchOptions) => Promise<QueryObserverResult<VedtaksbrevValgResponse, Error>>;
}

const buildInitialValues = (vedtaksbrevValg: VedtaksbrevValgResponse | undefined, redigert?: boolean) =>
  vedtaksbrevValg?.vedtaksbrevValg?.map(v => ({
    dokumentMalType: v.dokumentMalType,
    redigerAutomatiskBrev: redigert ? redigert : !!v.redigert || false,
    hindreUtsendingAvBrev: !!v.hindret || false,
    redigertHtml: v.redigertBrevHtml ?? '',
    originalHtml: '',
  })) ?? [];

export const UngVedtak = ({
  api,
  behandling,
  aksjonspunkter,
  submitCallback,
  vilkår,
  readOnly,
  vedtaksbrevValgResponse,
  refetchVedtaksbrevValg,
}: UngVedtakProps) => {
  const formMethods = useForm<FormData>({
    defaultValues: { vedtaksbrevValg: buildInitialValues(vedtaksbrevValgResponse) },
  });
  const behandlingErInnvilget = behandling.behandlingsresultat?.type === BehandlingDtoBehandlingResultatType.INNVILGET;
  const behandlingErAvslått = behandling.behandlingsresultat?.type === BehandlingDtoBehandlingResultatType.AVSLÅTT;
  const harAksjonspunkt = aksjonspunkter.some(ap => ap.kanLoses);
  const harAksjonspunktMedTotrinnsbehandling = aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling);
  // const redigerAutomatiskBrev = useWatch({ control: formMethods.control, name: 'redigerAutomatiskBrev' });
  // const hindreUtsendingAvBrev = useWatch({ control: formMethods.control, name: 'hindreUtsendingAvBrev' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const behandlingErAvsluttet = behandling.status === BehandlingDtoStatus.AVSLUTTET;

  const { refetch: forhåndsvisVedtaksbrev, isLoading: forhåndsvisningIsLoading } = useQuery({
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

  const { refetch: hentFritekstbrevHtml } = useQuery({
    queryKey: ['hentFritekstbrevHtml', behandling.id],
    queryFn: async () => {
      const response = await api.forhåndsvisVedtaksbrev(behandling.id, true);
      return response;
    },
    enabled: false,
  });

  const resetForm = async () => {
    const resetValues = await refetchVedtaksbrevValg();
    formMethods.reset({
      vedtaksbrevValg: buildInitialValues(resetValues?.data, true),
    });
  };

  const { mutate: lagreVedtaksbrev } = useMutation({
    mutationFn: async ({
      redigertHtml,
      nullstill,
      dokumentMalType,
    }: {
      redigertHtml: string;
      nullstill?: boolean;
      dokumentMalType: DokumentMalType | undefined;
    }) => {
      const requestData = {
        behandlingId: behandling.id,
        redigertHtml: redigertHtml || undefined,
        redigert: nullstill ? false : true,
        dokumentMalType,
      };
      await api.lagreVedtaksbrev(requestData);
      if (nullstill) {
        await resetForm();
      }
    },
  });

  const { fields } = useFieldArray({
    control: formMethods.control,
    name: 'vedtaksbrevValg',
  });

  const fieldValues = formMethods.watch('vedtaksbrevValg');

  const transformValues = () => aksjonspunkter.filter(ap => ap.kanLoses).map(ap => ({ kode: ap.definisjon }));
  const handleSubmit = () => {
    setIsSubmitting(true);
    void submitCallback(transformValues()).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
      <Box.New marginBlock="4">
        <VStack gap="space-16">
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
          {fields.map((field, index) => {
            const vedtaksbrevValg = vedtaksbrevValgResponse?.vedtaksbrevValg?.[index];
            return (
              <div key={field.id}>
                <HStack justify="space-between">
                  <VStack gap="space-16">
                    <div>
                      {fieldValues[index]?.redigerAutomatiskBrev && (
                        <FritekstBrevpanel
                          readOnly={readOnly}
                          redigertBrevHtml={vedtaksbrevValg?.redigertBrevHtml}
                          hentFritekstbrevHtml={hentFritekstbrevHtml}
                          lagreVedtaksbrev={lagreVedtaksbrev}
                          handleForhåndsvis={() => forhåndsvisVedtaksbrev()}
                          fieldIndex={index}
                        />
                      )}
                      {vedtaksbrevValgResponse?.harBrev && (
                        <Button
                          variant="tertiary"
                          onClick={() => forhåndsvisVedtaksbrev()}
                          size="small"
                          icon={<FileSearchIcon aria-hidden fontSize="1.5rem" />}
                          loading={forhåndsvisningIsLoading}
                          type="button"
                          disabled={!vedtaksbrevValgResponse?.harBrev}
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
                          {vedtaksbrevValg?.enableRediger && (
                            <RhfCheckbox
                              control={formMethods.control}
                              name={`vedtaksbrevValg.${index}.redigerAutomatiskBrev`}
                              label="Rediger automatisk brev"
                              disabled={
                                !vedtaksbrevValg.kanOverstyreRediger ||
                                fieldValues?.[index]?.hindreUtsendingAvBrev ||
                                readOnly
                              }
                            />
                          )}
                          {vedtaksbrevValg?.enableHindre && (
                            <RhfCheckbox
                              control={formMethods.control}
                              name={`vedtaksbrevValg.${index}.hindreUtsendingAvBrev`}
                              label="Hindre utsending av brev"
                              disabled={
                                !vedtaksbrevValg.kanOverstyreHindre ||
                                fieldValues?.[index]?.redigerAutomatiskBrev ||
                                readOnly
                              }
                            />
                          )}
                        </div>
                      </Fieldset>
                    </div>
                  )}
                </HStack>
              </div>
            );
          })}
        </VStack>
      </Box.New>
    </RhfForm>
  );
};
