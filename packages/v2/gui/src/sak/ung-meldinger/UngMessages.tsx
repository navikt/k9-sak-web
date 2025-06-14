import type {
  InformasjonsbrevBestillingRequest,
  InformasjonsbrevBestillingRequestDokumentMalType,
  InformasjonsbrevValgDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { FileSearchIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { Button, HStack, Spacer, VStack } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FritekstInput } from './FritekstInput';
import { MalSelect } from './MalSelect';
import MottakerSelect from './MottakerSelect';
import type { UngMeldingerBackendType } from './UngMeldingerBackendType';
import type { UngMessagesFormState } from './UngMessagesFormState';

interface UngMessagesProps {
  api: UngMeldingerBackendType;
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
  const showFritekstInput = (valgtMal?.støtterFritekst || valgtMal?.støtterTittelOgFritekst) ?? false;

  const { mutateAsync: bestillBrev, isPending: isSubmittingBestillBrev } = useMutation({
    mutationFn: (payload: InformasjonsbrevBestillingRequest) => api.bestillBrev(payload),
  });

  const { mutateAsync: forhåndsvisBrev, isPending: isSubmittingForhåndsvisBrev } = useMutation({
    mutationFn: (payload: InformasjonsbrevBestillingRequest) => api.forhåndsvisBrev(payload),
  });

  const lagPayload = (data: UngMessagesFormState): InformasjonsbrevBestillingRequest => {
    const valgtMottaker = mottakere?.find(mottaker => mottaker.id === data.mottaker);
    return {
      behandlingId,
      dokumentMalType: data.valgtMalkode as InformasjonsbrevBestillingRequestDokumentMalType,
      innhold: { overskrift: data.overskrift, brødtekst: data.brødtekst },
      mottaker:
        valgtMottaker && valgtMottaker.id && valgtMottaker.idType
          ? { id: valgtMottaker?.id, type: valgtMottaker?.idType }
          : undefined,
    };
  };

  const handleSubmit = async (data: UngMessagesFormState) => {
    try {
      await bestillBrev(lagPayload(data));
      onMessageSent();
    } catch (error) {
      console.error('Feil ved sending av brev:', error);
    }
  };

  const handlePreview = async (data: UngMessagesFormState) => {
    try {
      const pdfBlob = await forhåndsvisBrev(lagPayload(data));
      const objectUrl = URL.createObjectURL(pdfBlob);
      window.open(objectUrl);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Feil ved forhåndsvisning av brev:', error);
    }
  };

  const isSubmitting = isSubmittingBestillBrev || isSubmittingForhåndsvisBrev;

  return (
    <Form formMethods={formMethods}>
      <VStack gap="4">
        {brevmaler && <MalSelect brevmaler={brevmaler} />}
        {mottakere && <MottakerSelect mottakere={mottakere} valgtMal={valgtMal} disabled={false} />}
        {showFritekstInput && (
          <FritekstInput malStøtterTittel={!!valgtMal?.støtterTittelOgFritekst} språkkode={språkkode} />
        )}
        <HStack gap="3">
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
    </Form>
  );
};
