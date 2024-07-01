/*
 * Noen kodeverkoppføringer inneholder foreløpig ekstra attributter i kodeverkobjktet. Disse skal ikke konverteres (enda)
 */
const ignorerKodeverkKonvertering = ['AKSJONSPUNKT_DEF'];

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
        !ignorerKodeverkKonvertering.includes(data[key]?.kodeverk) &&
        ((data[key]?.kodeverk && antallAttr === lengdeKodeverkObjekt) ||
          antallAttr === 1 ||
          data[key]?.kodeverk === 'BEHANDLING_RESULTAT_TYPE') // Skrive om denne foreløpig, de ekstra attributtene skal fjernes i backend
      ) {
        data[key] = data[key].kode; // eslint-disable-line no-param-reassign
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      konverterKodeverkTilKode(data[key], erTilbakekreving);
    }
  });
};
