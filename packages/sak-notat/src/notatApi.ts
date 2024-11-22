import { apiPaths } from '@k9-sak-web/rest-api';
import { NotatGjelderType, NotatResponse } from '@k9-sak-web/types';
import { sakstype as GeneratedSakstype } from '@navikt/k9-sak-typescript-client';
import axios from 'axios';
import { Inputs } from './Notater';

const isSakstypeUng = (sakstype: string) => sakstype === GeneratedSakstype.UNG;

export const postNotat = (
  data: Inputs,
  fagsakId: string,
  sakstype: string,
  id?: number,
  fagsakIdFraRedigertNotat?: string,
  versjon?: number,
) => {
  let notatGjelderType;
  if (!id) {
    notatGjelderType = data.visNotatIAlleSaker ? NotatGjelderType.pleietrengende : NotatGjelderType.fagsak;
  }
  const backendUrl = isSakstypeUng(sakstype) ? 'ung' : 'k9';
  const postUrl = id ? `/${backendUrl}/sak/api/notat/endre` : `/${backendUrl}/sak/api/notat`;
  return axios.post(postUrl, {
    notatTekst: data.notatTekst,
    saksnummer: fagsakIdFraRedigertNotat || fagsakId,
    notatGjelderType,
    versjon: versjon || 0,
    notatId: id,
  });
};

export const skjulNotat = (skjul: boolean, id: number, saksnummer: string, versjon: number, sakstype: string) => {
  const backendUrl = isSakstypeUng(sakstype) ? 'ung' : 'k9';
  return axios.post(`/${backendUrl}/sak/api/notat/skjul`, {
    notatId: id,
    skjul,
    saksnummer,
    versjon,
  });
};

export const getNotater = (signal: AbortSignal, fagsakId: string, sakstype: string) => {
  const url = isSakstypeUng(sakstype) ? apiPaths.notatISakUng : apiPaths.notatISakK9;
  return axios
    .get<NotatResponse[]>(url, {
      signal,
      params: {
        saksnummer: fagsakId,
      },
    })
    .then(({ data }) => data);
};
