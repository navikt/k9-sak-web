import { Alert, Loader } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import type { UngMeldingerBackendApi } from './UngMeldingerBackendApi';
import { UngMessages } from './UngMessages';
import type { UngMessagesFormState } from './UngMessagesFormState';

interface UngMessagesProps {
  api: UngMeldingerBackendApi;
  behandlingId: number;
  språkkode: string;
  onMessageSent: () => void;
  ungMessagesFormValues: UngMessagesFormState | undefined;
  setUngMessagesFormValues: React.Dispatch<React.SetStateAction<UngMessagesFormState | undefined>>;
}

export const UngMessagesIndex = (props: UngMessagesProps) => {
  const { api, behandlingId, onMessageSent, språkkode, ungMessagesFormValues, setUngMessagesFormValues } = props;
  const {
    data: brevmaler,
    isLoading: brevmalerIsLoading,
    isError: brevmalerIsError,
  } = useQuery({
    queryKey: ['brevmaler', behandlingId],
    queryFn: () => api.hentMaler(behandlingId),
    select: data => data?.informasjonbrevValg ?? [],
  });
  if (brevmalerIsLoading || !brevmaler) {
    return <Loader size="large" />;
  }
  if (brevmalerIsError) {
    return <Alert variant="error">Feil ved henting av maler. Brevsending ikke mulig</Alert>;
  }

  return (
    <UngMessages
      api={api}
      brevmaler={brevmaler}
      behandlingId={behandlingId}
      onMessageSent={onMessageSent}
      språkkode={språkkode}
      ungMessagesFormValues={ungMessagesFormValues}
      setUngMessagesFormValues={setUngMessagesFormValues}
    />
  );
};
