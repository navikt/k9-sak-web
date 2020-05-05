import { createSelector } from 'reselect';
import fpsakApi from '../data/fpsakApi';

/* Selectors */
export const getAlleFpSakKodeverk = createSelector(
  [fpsakApi.KODEVERK.getRestApiData(), fpsakApi.KODEVERK_KLAGE.getRestApiData()],
  (kodeverk_sak = {}, kodeverk_klage = {}) => {

    if (Object.keys(kodeverk_klage).length) {

      const sammenflettedeKodeverk = {};

      // Går igjennom kodeverkene fra k9-sak og for å flette de sammen med tilsvarende kodeverk i k9-klage
      Object.keys(kodeverk_sak).forEach((kv) => {

        if (!!kodeverk_klage[kv] && Array.isArray(kodeverk_klage[kv]) && Array.isArray(kodeverk_sak[kv])) {

          // Fletter sammen kodeverk som heter det samme i k9-sak og k9-klage
          const koder = new Set(kodeverk_sak[kv].map(k => k.kode));
          sammenflettedeKodeverk[kv] = [...kodeverk_sak[kv], ...kodeverk_klage[kv].filter(k => !koder.has(k.kode))];
        } else {

          // Tar k9-sak sin versjon hvis det ikke finnes noe kodeverk med samme navn i klage
          sammenflettedeKodeverk[kv] = kodeverk_sak[kv];
        }
      });

      return {...kodeverk_klage, ...sammenflettedeKodeverk};
    }
    return kodeverk_sak;
  }
);
export const getAlleFpTilbakeKodeverk = createSelector(
  [fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (kodeverk = {}) => kodeverk,
);

export const getKodeverk = kodeverkType =>
  createSelector([getAlleFpSakKodeverk], (kodeverk = {}) => kodeverk[kodeverkType]);

export const getFpTilbakeKodeverk = kodeverkType =>
  createSelector([fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()], (kodeverk = {}) => kodeverk[kodeverkType]);

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
