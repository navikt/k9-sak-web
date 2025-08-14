import type {
  ung_sak_kontrakt_formidling_informasjonsbrev_InformasjonsbrevBestillingRequest as InformasjonsbrevBestillingRequest,
  ung_kodeverk_dokument_DokumentMalType as DokumentMalType,
  ung_sak_kontrakt_formidling_informasjonsbrev_InformasjonsbrevValgDto as InformasjonsbrevValgDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { FileSearchIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { Button, HStack, Spacer, VStack } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FritekstInput } from './FritekstInput';
import { MalSelect } from './MalSelect';
import MottakerSelect from './MottakerSelect';
import type { UngMeldingerBackendApi } from './UngMeldingerBackendApi';
import type { UngMessagesFormState } from './UngMessagesFormState';

interface UngMessagesProps {
  api: UngMeldingerBackendApi;
  behandlingId: number;
  språkkode: string;
  onMessageSent: () => void;
  brevmaler: InformasjonsbrevValgDto[];
  ungMessagesFormValues: UngMessagesFormState | undefined;
  setUngMessagesFormValues: React.Dispatch<React.SetStateAction<UngMessagesFormState | undefined>>;
}

export const UngMessages = (props: UngMessagesProps) => {
  const { api, behandlingId, språkkode, onMessageSent, brevmaler, ungMessagesFormValues, setUngMessagesFormValues } =
    props;

  const formMethods = useForm<UngMessagesFormState>({
    defaultValues: ungMessagesFormValues ?? {
      valgtMalkode: brevmaler.length === 1 ? brevmaler[0]?.malType?.kode : '',
      overskrift: '',
      brødtekst: '',
      mottaker: '',
    },
  });

  useEffect(() => {
    return () => {
      setUngMessagesFormValues(formMethods.getValues());
    };
  }, [formMethods, setUngMessagesFormValues]);

  const valgtMalkode = formMethods.watch('valgtMalkode');
  const mottakere = brevmaler?.find(mal => mal.malType?.kode === valgtMalkode)?.mottakere;
  const valgtMal = brevmaler?.find(mal => mal.malType?.kode === valgtMalkode);
  const showFritekstInput = !!valgtMal?.støtterFritekst || !!valgtMal?.støtterTittelOgFritekst;

  const { mutateAsync: bestillBrev, isPending: isSubmittingBestillBrev } = useMutation({
    mutationFn: (payload: InformasjonsbrevBestillingRequest) => api.bestillBrev(payload),
  });

  const { mutateAsync: forhåndsvisBrev, isPending: isSubmittingForhåndsvisBrev } = useMutation({
    mutationFn: (payload: InformasjonsbrevBestillingRequest) => api.forhåndsvisBrev(payload),
  });

  const lagPayload = (data: UngMessagesFormState): InformasjonsbrevBestillingRequest | undefined => {
    const valgtMottaker = mottakere?.find(mottaker => mottaker.id === data.mottaker);
    if (valgtMottaker && valgtMottaker.id && valgtMottaker.idType) {
      return {
        behandlingId,
        dokumentMalType: data.valgtMalkode as DokumentMalType,
        innhold: { overskrift: data.overskrift, brødtekst: data.brødtekst },
        mottaker: { id: valgtMottaker?.id, type: valgtMottaker?.idType },
      };
    }
    return undefined;
  };

  const handleSubmit = async (data: UngMessagesFormState) => {
    try {
      const payload = lagPayload(data);
      if (!payload) {
        throw new Error('Ingen gyldig mottaker valgt eller maltype angitt');
      }
      await bestillBrev(payload);
      onMessageSent();
    } catch (error) {
      console.error('Feil ved sending av brev:', error);
    }
  };

  const handlePreview = async (data: UngMessagesFormState) => {
    try {
      const payload = lagPayload(data);
      if (!payload) {
        throw new Error('Ingen gyldig mottaker valgt eller maltype angitt');
      }
      const pdfBlob = await forhåndsvisBrev(payload);
      const objectUrl = URL.createObjectURL(pdfBlob);
      window.open(objectUrl);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Feil ved forhåndsvisning av brev:', error);
    }
  };

  const isSubmitting = isSubmittingBestillBrev || isSubmittingForhåndsvisBrev;

  return (
    <RhfForm formMethods={formMethods}>
      <VStack gap="space-16">
        {brevmaler && <MalSelect brevmaler={brevmaler} />}
        {mottakere && <MottakerSelect mottakere={mottakere} valgtMal={valgtMal} disabled={false} />}
        {showFritekstInput && (
          <FritekstInput malStøtterTittel={!!valgtMal?.støtterTittelOgFritekst} språkkode={språkkode} />
        )}
        <HStack gap="space-12">
          <Button
            type="submit"
            size="small"
            variant="primary"
            icon={<PaperplaneIcon />}
            loading={isSubmitting}
            onClick={formMethods.handleSubmit(handleSubmit)}
          >
            Send brev
          </Button>
          <Spacer />
          <Button
            size="small"
            variant="secondary"
            icon={<FileSearchIcon />}
            loading={isSubmitting}
            onClick={formMethods.handleSubmit(handlePreview)}
          >
            Forhåndsvis
          </Button>
        </HStack>
      </VStack>
    </RhfForm>
  );
};
