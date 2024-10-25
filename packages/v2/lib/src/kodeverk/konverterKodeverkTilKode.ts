/*
 * Rekursivt konverterer kodeverkobjekter til kodeverkstrenger
 */
export const konverterKodeverkTilKode = (data: any, erTilbakekreving: boolean) => {
  if (data === undefined || data === null) return;

  const lengdeKodeverkObjekt = erTilbakekreving ? 3 : 2;

  Object.keys(data).forEach(key => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if (
        (data[key]?.kodeverk && antallAttr === lengdeKodeverkObjekt) ||
        antallAttr === 1 ||
        [
          'AKSJONSPUNKT_DEF', // Skrive om denne foreløpig, de ekstra attributtene skal fjernes i backend
          'BEHANDLING_RESULTAT_TYPE', // Skrive om denne foreløpig, de ekstra attributtene skal fjernes i backend
          'HISTORIKKINNSLAG_TYPE', // Inneholder .mal, men mal brukes ikke. Malen utledes fra .kode
          'SKJERMLENKE_TYPE', // Denne er anderledes fra de andre, og har tre attributter selv om det ikke er fra tilbakekreving
        ].includes(data[key]?.kodeverk)
      ) {
        data[key] = data[key].kode; // eslint-disable-line no-param-reassign
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      konverterKodeverkTilKode(data[key], erTilbakekreving);
    }
  });
};
