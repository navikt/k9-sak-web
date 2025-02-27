/*
 * Rekursivt konverterer selektivt kodeverkobjekter til kodeverkstrenger.
 * For gradvis innføring av overgangen til nytt kodeverk vil bruk av denne funksjonen gjøre
 * at vi kan skrive om kodeverkene gradvis.
 */

import { KodeverkTypeV2 } from './types/KodeverkTypeV2';

const kodeverkSomSkalSkrivesOm: string[] = Object.keys(KodeverkTypeV2);

export const konverterKodeverkTilKodeSelektivt = (data: any, erTilbakekreving: boolean) => {
  if (data === undefined || data === null) return;

  const lengdeKodeverkObjekt = erTilbakekreving ? 3 : 2;
  Object.keys(data).forEach(key => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if (
        ((data[key]?.kodeverk && antallAttr === lengdeKodeverkObjekt) || antallAttr === 1) &&
        kodeverkSomSkalSkrivesOm.includes(data[key]?.kodeverk)

        // Beholder denne inntill videre, for dokumentasjon frem til ferdig med kodeverkomskriving
        // [
        //   'AKSJONSPUNKT_DEF', // Skrive om denne foreløpig, de ekstra attributtene skal fjernes i backend
        //   'BEHANDLING_RESULTAT_TYPE', // Skrive om denne foreløpig, de ekstra attributtene skal fjernes i backend
        //   'HISTORIKKINNSLAG_TYPE', // Inneholder .mal, men mal brukes ikke. Malen utledes fra .kode
        // ].includes(data[key]?.kodeverk)
      ) {
        data[key] = data[key].kode; // eslint-disable-line no-param-reassign
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      konverterKodeverkTilKodeSelektivt(data[key], erTilbakekreving);
    }
  });
};
