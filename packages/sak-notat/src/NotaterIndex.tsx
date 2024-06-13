import { NavAnsatt } from '@k9-sak-web/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import Notater, { Inputs, skjulNotatMutationVariables } from './Notater';
import { getNotater, postNotat, skjulNotat } from './notatApi';

interface NotaterIndexProps {
  fagsakId: string;
  navAnsatt: NavAnsatt;
  fagsakHarPleietrengende: boolean;
}

interface postNotatMutationVariables {
  data: Inputs;
  id?: number;
  fagsakIdFraRedigertNotat?: string;
  versjon?: number;
}

const NotaterIndex: React.FC<NotaterIndexProps> = ({ fagsakId, navAnsatt, fagsakHarPleietrengende }) => {
  const queryClient = useQueryClient();

  const notaterQueryKey = ['notater', fagsakId];

  const formMethods = useForm<Inputs>({
    defaultValues: {
      notatTekst: '',
      visNotatIAlleSaker: false,
    },
  });

  const {
    isLoading: getNotaterLoading,
    isError: hasGetNotaterError,
    data: notater,
  } = useQuery({
    queryKey: notaterQueryKey,
    queryFn: ({ signal }) => getNotater(signal, fagsakId),
    enabled: !!fagsakId,
  });

  const postNotatMutation = useMutation({
    mutationFn: ({ data, id, fagsakIdFraRedigertNotat, versjon }: postNotatMutationVariables) =>
      postNotat(data, fagsakId, id, fagsakIdFraRedigertNotat, versjon),

    onSuccess: () => {
      formMethods.reset();
      queryClient.invalidateQueries({ queryKey: notaterQueryKey });
    },
  });

  const skjulNotatMutation = useMutation({
    mutationFn: ({ skjul, id, saksnummer, versjon }: skjulNotatMutationVariables) =>
      skjulNotat(skjul, id, saksnummer, versjon),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notaterQueryKey });
    },
  });

  const isLoading = getNotaterLoading || postNotatMutation.isLoading;

  const submitNotat = (data: Inputs, id?: number, fagsakIdFraRedigertNotat?: string, versjon?: number) =>
    postNotatMutation.mutate({ data, id, fagsakIdFraRedigertNotat, versjon });

  const submitSkjulNotat = (data: skjulNotatMutationVariables) => skjulNotatMutation.mutate(data);

  return (
    <Notater
      fagsakId={fagsakId}
      navAnsatt={navAnsatt}
      submitNotat={submitNotat}
      isLoading={isLoading}
      hasGetNotaterError={hasGetNotaterError}
      notater={notater}
      postNotatMutationError={postNotatMutation.isError}
      submitSkjulNotat={submitSkjulNotat}
      formMethods={formMethods}
      fagsakHarPleietrengende={fagsakHarPleietrengende}
    />
  );
};

export default NotaterIndex;
