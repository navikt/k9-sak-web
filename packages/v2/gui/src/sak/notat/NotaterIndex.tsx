import {
  type sif_abac_kontrakt_abac_InnloggetAnsattDto as InnloggetAnsattDto,
  type k9_sak_kontrakt_notat_NotatDto as NotatDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import NotatBackendClient from './NotatBackendClient';
import Notater, { type skjulNotatMutationVariables } from './Notater.js';
import { type FormState } from './types/FormState';

interface NotaterIndexProps {
  fagsakId: string;
  navAnsatt: Pick<InnloggetAnsattDto, 'brukernavn'>;
  fagsakHarPleietrengende: boolean;
  sakstype: FagsakYtelsesType;
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

const NotaterIndex: React.FC<NotaterIndexProps> = ({ fagsakId, navAnsatt, fagsakHarPleietrengende, sakstype }) => {
  const notatBackendClient = new NotatBackendClient(sakstype === fagsakYtelsesType.UNGDOMSYTELSE ? 'ungSak' : 'k9Sak');

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
