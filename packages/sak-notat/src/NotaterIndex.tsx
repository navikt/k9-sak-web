import { useLocalStorage } from '@fpsak-frontend/utils';
import { NavAnsatt } from '@k9-sak-web/types';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Notater, { Inputs, skjulNotatMutationVariables } from './Notater';
import { NotatGjelderType } from './types/NotatGjelderType';
import { NotatResponse } from './types/NotatResponse';

interface NotaterIndexProps {
  fagsakId: string;
  navAnsatt: NavAnsatt;
}

interface postNotatMutationVariables {
  data: Inputs;
  id?: number;
  fagsakIdFraRedigertNotat?: string;
  versjon?: number;
}

const NotaterIndex: React.FC<NotaterIndexProps> = ({ fagsakId, navAnsatt }) => {
  const [lesteNotater, setLesteNotater] = useLocalStorage<number[]>('lesteNotater', []);
  const queryClient = useQueryClient();

  const notaterQueryKey = ['notater', fagsakId];

  const formMethods = useForm<Inputs>({
    defaultValues: {
      notatTekst: '',
      visNotatIAlleSaker: false,
    },
  });

  const getNotater = (signal: AbortSignal) =>
    axios
      .get<NotatResponse[]>(`/k9/sak/api/notat`, {
        signal,
        params: {
          saksnummer: fagsakId,
        },
      })
      .then(({ data }) => {
        const sorterteNotater = [...data].sort(
          (notatA, notatB) => +new Date(notatA.opprettetTidspunkt) - +new Date(notatB.opprettetTidspunkt),
        );
        setLesteNotater([
          ...new Set([...lesteNotater, ...data.filter(notat => !notat.skjult).map(notat => notat.notatId)]),
        ]);
        return sorterteNotater;
      });

  const {
    isLoading: getNotaterLoading,
    isError: hasGetNotaterError,
    data: notater,
  } = useQuery({ queryKey: notaterQueryKey, queryFn: ({ signal }) => getNotater(signal), enabled: !!fagsakId });

  const postNotat = (data: Inputs, id?: number, fagsakIdFraRedigertNotat?: string, versjon?: number) => {
    let notatGjelderType;
    if (!id) {
      notatGjelderType = data.visNotatIAlleSaker ? NotatGjelderType.pleietrengende : NotatGjelderType.fagsak;
    }
    const postUrl = id ? '/k9/sak/api/notat/endre' : '/k9/sak/api/notat';
    return axios.post(postUrl, {
      notatTekst: data.notatTekst,
      saksnummer: fagsakIdFraRedigertNotat || fagsakId,
      notatGjelderType,
      versjon: versjon || 0,
      notatId: id,
    });
  };

  const postNotatMutation = useMutation(
    ({ data, id, fagsakIdFraRedigertNotat, versjon }: postNotatMutationVariables) =>
      postNotat(data, id, fagsakIdFraRedigertNotat, versjon),
    {
      onSuccess: () => {
        formMethods.reset();
        queryClient.invalidateQueries({ queryKey: notaterQueryKey });
      },
    },
  );

  const skjulNotat = (skjul: boolean, id: number, saksnummer: string, versjon: number) =>
    axios.post('/k9/sak/api/notat/skjul', {
      notatId: id,
      skjul,
      saksnummer,
      versjon,
    });

  const skjulNotatMutation = useMutation(
    ({ skjul, id, saksnummer, versjon }: skjulNotatMutationVariables) => skjulNotat(skjul, id, saksnummer, versjon),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: notaterQueryKey });
      },
    },
  );

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
    />
  );
};

export default NotaterIndex;
