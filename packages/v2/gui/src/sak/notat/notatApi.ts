import { OpprettNotatDtoNotatGjelderType } from '@k9-sak-web/backend/k9sak/generated';
import axios from 'axios';
import { apiPaths } from './apiPaths';
import { type FormState } from './types/FormState';
import type { NotatResponse } from './types/NotatResponse';

export const postNotat = (
  data: FormState,
  fagsakId: string,
  id?: number,
  fagsakIdFraRedigertNotat?: string,
  versjon?: number,
) => {
  let notatGjelderType;
  if (!id) {
    notatGjelderType = data.visNotatIAlleSaker
      ? OpprettNotatDtoNotatGjelderType.PLEIETRENGENDE
      : OpprettNotatDtoNotatGjelderType.FAGSAK;
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

export const skjulNotat = (skjul: boolean, id: number, saksnummer: string, versjon: number) =>
  axios.post('/k9/sak/api/notat/skjul', {
    notatId: id,
    skjul,
    saksnummer,
    versjon,
  });

export const getNotater = (signal: AbortSignal, fagsakId: string) =>
  axios
    .get<NotatResponse[]>(apiPaths.notatISak, {
      signal,
      params: {
        saksnummer: fagsakId,
      },
    })
    .then(({ data }) => data);
