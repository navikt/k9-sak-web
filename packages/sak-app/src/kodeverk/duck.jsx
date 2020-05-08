import behandlingType from "@fpsak-frontend/kodeverk/src/behandlingType";
import { createSelector } from 'reselect';
import fpsakApi from '../data/fpsakApi';

/* Selectors */
export const getAlleFpSakKodeverk = createSelector(
  [fpsakApi.KODEVERK.getRestApiData()],
  (kodeverk = {}) => kodeverk
);
export const getAlleFpTilbakeKodeverk = createSelector(
  [fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (kodeverk = {}) => kodeverk,
);
export const getAlleKlagekodeverk = createSelector(
  [fpsakApi.KODEVERK_KLAGE.getRestApiData()],
  (kodeverk = {}) => kodeverk
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
    case behandlingType.TILBAKEKREVING_REVURDERING: return getAlleFpTilbakeKodeverk;
    case behandlingType.KLAGE: return getAlleKlagekodeverk;
    default: return getAlleFpSakKodeverk;
  }
};

export const getKodeverkForBehandlingstype = behandlingstype => {
  switch (behandlingstype) {
    case behandlingType.TILBAKEKREVING:
    case behandlingType.TILBAKEKREVING_REVURDERING: return getFpTilbakeKodeverk;
    case behandlingType.KLAGE: return getKlagekodeverk;
    default: return getKodeverk;
  }
};

// TODO (TOR) Fjern denne
export const getAlleKodeverk = createSelector(
  [fpsakApi.KODEVERK.getRestApiData(), fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (kodeverkFpsak = {}, kodeverkFptilbake = {}) => {
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
