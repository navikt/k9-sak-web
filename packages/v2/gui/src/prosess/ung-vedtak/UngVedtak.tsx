import {
  ung_kodeverk_behandling_BehandlingResultatType as BehandlingDtoBehandlingResultatType,
  ung_kodeverk_dokument_DokumentMalType as DokumentMalType,
  type ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  type ung_kodeverk_KodeverdiSomObjektUng_kodeverk_dokument_DokumentMalType,
  type ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgResponse as VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Alert, BodyShort, Box, Button, Label, VStack } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { useMutation, type QueryObserverResult, type RefetchOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import ContentMaxWidth from '../../shared/ContentMaxWidth/ContentMaxWidth';
import AvslagsårsakListe from './AvslagsårsakListe';
import { FritekstBrevpanel } from './brev/FritekstBrevpanel';
import type { FormData } from './FormData';
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

const buildInitialValues = (vedtaksbrevValg: VedtaksbrevValgResponse | undefined) =>
  vedtaksbrevValg?.vedtaksbrevValg?.map(v => ({
    dokumentMalType: v.dokumentMalType?.kilde,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forhåndsvisningIsLoading, setForhåndsvisningIsLoading] = useState(false);

  const forhåndsvisVedtaksbrev = async (
    dokumentMalType?: ung_kodeverk_KodeverdiSomObjektUng_kodeverk_dokument_DokumentMalType,
  ) => {
    if (dokumentMalType) {
      setForhåndsvisningIsLoading(true);
      const response = await api.forhåndsvisVedtaksbrev(behandling.id, dokumentMalType?.kilde, false);
      setForhåndsvisningIsLoading(false);
      // Create a URL object from the PDF blob
      const fileURL = window.URL.createObjectURL(response);
      // Open the PDF in a new tab
      window.open(fileURL, '_blank');
      return response;
    }
    return;
  };

  const hentOriginalHtml = async (
    dokumentMalType: ung_kodeverk_KodeverdiSomObjektUng_kodeverk_dokument_DokumentMalType | undefined,
  ) => {
    if (dokumentMalType) {
      const response = await api.forhåndsvisVedtaksbrev(behandling.id, dokumentMalType.kilde, true, false);
      return response;
    }
    return {};
  };

  const resetForm = async () => {
    const resetValues = await refetchVedtaksbrevValg();
    formMethods.reset({
      vedtaksbrevValg: buildInitialValues(resetValues?.data),
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
      dokumentMalType: DokumentMalType;
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

          <ContentMaxWidth>
            <Alert variant="info" size="small">
              Du har flere brev
            </Alert>
          </ContentMaxWidth>
          <VStack gap="space-16">
            {fields.map((field, index) => {
              const vedtaksbrevValg = vedtaksbrevValgResponse?.vedtaksbrevValg?.[index];

              return (
                <div key={field.id}>
                  <Box.New
                    borderWidth={index === 0 ? '0 0 1 0' : '0'}
                    paddingBlock={readOnly ? '0' : '0 space-20'}
                    width="450px"
                  >
                    {vedtaksbrevValgResponse?.harBrev && (
                      <FritekstBrevpanel
                        readOnly={readOnly}
                        redigertBrevHtml={vedtaksbrevValg?.redigertBrevHtml}
                        hentOriginalHtml={() => hentOriginalHtml(vedtaksbrevValg?.dokumentMalType)}
                        lagreVedtaksbrev={lagreVedtaksbrev}
                        handleForhåndsvis={() => forhåndsvisVedtaksbrev(vedtaksbrevValg?.dokumentMalType)}
                        fieldIndex={index}
                        vedtaksbrevValg={vedtaksbrevValg}
                        forhåndsvisningIsLoading={forhåndsvisningIsLoading}
                      />
                    )}
                  </Box.New>
                </div>
              );
            })}
          </VStack>
        </VStack>
        {harAksjonspunkt && !readOnly && (
          <Box.New marginBlock="space-24 0">
            <Button type="submit" variant="primary" size="small" loading={isSubmitting}>
              {harAksjonspunktMedTotrinnsbehandling ? 'Send til beslutter' : 'Fatt vedtak'}
            </Button>
          </Box.New>
        )}
      </Box.New>
    </RhfForm>
  );
};
