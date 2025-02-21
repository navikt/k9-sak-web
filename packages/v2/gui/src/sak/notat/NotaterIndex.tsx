import { type InnloggetAnsattDto, type NotatDto } from '@k9-sak-web/backend/k9sak/generated';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { K9SakClientContext } from '../../app/K9SakClientContext';
import NotatBackendClient from './NotatBackendClient';
import Notater, { type skjulNotatMutationVariables } from './Notater.js';
import { type FormState } from './types/FormState';

interface NotaterIndexProps {
  fagsakId: string;
  navAnsatt: Pick<InnloggetAnsattDto, 'brukernavn'>;
  fagsakHarPleietrengende: boolean;
}

interface opprettNotatMutationVariables {
  data: FormState;
}

interface endreNotatMutationVariables {
  data: FormState;
  id: string;
  fagsakIdFraRedigertNotat: string;
  versjon: number;
}

const NotaterIndex: React.FC<NotaterIndexProps> = ({ fagsakId, navAnsatt, fagsakHarPleietrengende }) => {
  const k9SakClient = useContext(K9SakClientContext);
  const notatBackendClient = new NotatBackendClient(k9SakClient);

  const notaterQueryKey = ['notater', fagsakId];

  const formMethods = useForm<FormState>({
    defaultValues: {
      notatTekst: '',
      visNotatIAlleSaker: false,
    },
  });

  const {
    isLoading: getNotaterLoading,
    isError: hasGetNotaterError,
    data: notater = [],
    refetch: refetchNotater,
  } = useQuery<NotatDto[]>({
    queryKey: notaterQueryKey,
    queryFn: () => notatBackendClient.getNotater(fagsakId),
    enabled: !!fagsakId,
  });

  const opprettNotatMutation = useMutation({
    mutationFn: ({ data }: opprettNotatMutationVariables) => notatBackendClient.opprettNotat(data, fagsakId),
    onSuccess: async () => {
      formMethods.reset();
      await refetchNotater();
    },
  });

  const endreNotatMutation = useMutation({
    mutationFn: ({ data, id, fagsakIdFraRedigertNotat, versjon }: endreNotatMutationVariables) =>
      notatBackendClient.endreNotat(data, id, fagsakIdFraRedigertNotat, versjon),
    onSuccess: async () => {
      formMethods.reset();
      await refetchNotater();
    },
  });

  const skjulNotatMutation = useMutation({
    mutationFn: ({ skjul, id, saksnummer, versjon }: skjulNotatMutationVariables) =>
      notatBackendClient.skjulNotat(id, saksnummer, skjul, versjon),
    onSuccess: async () => {
      await refetchNotater();
    },
  });

  const isLoading = getNotaterLoading || opprettNotatMutation.isPending;

  const endreNotat = (data: FormState, id: string, fagsakIdFraRedigertNotat: string, versjon: number) =>
    endreNotatMutation.mutate({ data, id, fagsakIdFraRedigertNotat, versjon });

  const opprettNotat = (data: FormState) => opprettNotatMutation.mutate({ data });

  const skjulNotat = (data: skjulNotatMutationVariables) => skjulNotatMutation.mutate(data);

  const hasLagreNotatError = opprettNotatMutation.isError || endreNotatMutation.isError || skjulNotatMutation.isError;

  return (
    <Notater
      fagsakId={fagsakId}
      navAnsatt={navAnsatt}
      opprettNotat={opprettNotat}
      endreNotat={endreNotat}
      isLoading={isLoading}
      hasGetNotaterError={hasGetNotaterError}
      notater={notater}
      hasLagreNotatError={hasLagreNotatError}
      skjulNotat={skjulNotat}
      formMethods={formMethods}
      fagsakHarPleietrengende={fagsakHarPleietrengende}
    />
  );
};

export default NotaterIndex;
