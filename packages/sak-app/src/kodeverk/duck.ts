import { createSelector } from 'reselect';

import { KodeverkMedNavn } from '@k9-sak-web/types';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import fpsakApi from '../data/fpsakApi';

/* Selectors */
export const getAlleFpSakKodeverk = createSelector(
  [fpsakApi.KODEVERK.getRestApiData()],
  (kodeverk: { [key: string]: KodeverkMedNavn[] } = {}) => kodeverk,
);
export const getAlleFpTilbakeKodeverk = createSelector(
  [fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (kodeverk: { [key: string]: KodeverkMedNavn[] } = {}) => kodeverk,
);
export const getAlleKlagekodeverk = createSelector(
  [fpsakApi.KODEVERK_KLAGE.getRestApiData()],
  (kodeverk: { [key: string]: KodeverkMedNavn[] } = {}) => kodeverk,
);

export const getKodeverk = kodeverkType =>
  createSelector([getAlleFpSakKodeverk], (kodeverk = {}) => kodeverk[kodeverkType]);

export const getFpTilbakeKodeverk = kodeverkType =>
  createSelector([fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()], (kodeverk = {}) => kodeverk[kodeverkType]);

export const getKlagekodeverk = kodeverkType =>
  createSelector([getAlleKlagekodeverk], (kodeverk = {}) => kodeverk[kodeverkType]);

export const getAlleKodeverkForBehandlingstype = behandlingstype => {
  switch (behandlingstype) {
    case behandlingType.TILBAKEKREVING:
    case behandlingType.TILBAKEKREVING_REVURDERING:
      return getAlleFpTilbakeKodeverk;
    case behandlingType.KLAGE:
      return getAlleKlagekodeverk;
    default:
      return getAlleFpSakKodeverk;
  }
};

export const getKodeverkForBehandlingstype = (behandlingstype, kodeverktype) => {
  switch (behandlingstype) {
    case behandlingType.TILBAKEKREVING:
    case behandlingType.TILBAKEKREVING_REVURDERING:
      return getFpTilbakeKodeverk(kodeverktype);
    case behandlingType.KLAGE:
      return getKlagekodeverk(kodeverktype);
    default:
      return getKodeverk(kodeverktype);
  }
};

// TODO (TOR) Fjern denne
export const getAlleKodeverk = createSelector(
  [fpsakApi.KODEVERK.getRestApiData(), fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (
    kodeverkFpsak: { [key: string]: KodeverkMedNavn[] } = {},
    kodeverkFptilbake: { [key: string]: KodeverkMedNavn[] } = {},
  ) => {
    const result = {
      ...kodeverkFpsak,
    };
    Object.keys(kodeverkFptilbake).forEach(key => {
      if (result[key]) {
        result[key] = result[key].concat(kodeverkFptilbake[key]);
      } else {
        result[key] = kodeverkFptilbake[key];
      }
    });
    return result;
  },
);
