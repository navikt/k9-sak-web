import { apiPaths } from '@k9-sak-web/rest-api';
import { NotatGjelderType, NotatResponse } from '@k9-sak-web/types';
import axios from 'axios';
import { Inputs } from './Notater';

export const postNotat = (
  data: Inputs,
  fagsakId: string,
  id?: number,
  fagsakIdFraRedigertNotat?: string,
  versjon?: number,
) => {
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
