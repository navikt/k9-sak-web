import axios from 'axios'; // midlertidig brukt i utvikling/debug

/*
 * Skal ikke committes/pushes, kun for local utviling/debugging
 */
const debugLogKodeverkData = async (kode: any, key: string, data: any) => {
  axios.post('http://localhost:4000/', { kode, key, data });
};

/*
 * Noen kodeverkoppføringer inneholder foreløpig ekstra attributter i kodeverkobjktet. Disse skal ikke konverteres (enda)
 */
const ignorerKodeverkKonvertering = ['AKSJONSPUNKT_DEF'];

/*
 * Identifiserer kodeverk
 */
export const identifiserKodeverk = (data: any, erTilbakekreving: boolean) => {
  if (data === undefined || data === null) return;

  const lengdeKodeverkObjekt = erTilbakekreving ? 3 : 2;

  Object.keys(data).forEach(key => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if (
        !ignorerKodeverkKonvertering.includes(data[key]?.kodeverk) &&
        ((data[key]?.kodeverk && antallAttr === lengdeKodeverkObjekt) || antallAttr === 1)
      ) {
        // data[key] = data[key].kode; // eslint-disable-line no-param-reassign
        console.log('Kodeverk: ', data[key]);
        debugLogKodeverkData(data[key], key, data);
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      identifiserKodeverk(data[key], erTilbakekreving);
    }
  });
};

/*
 * Rekursivt konverterer kodeverkobjekter til kodeverkstrenger
 */
export const konverterKodeverkTilKode = (data: any, erTilbakekreving: boolean, debug = false) => {
  if (data === undefined || data === null) return;

  const lengdeKodeverkObjekt = erTilbakekreving ? 3 : 2;

  Object.keys(data).forEach(key => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if (
        !ignorerKodeverkKonvertering.includes(data[key]?.kodeverk) &&
        ((data[key]?.kodeverk && antallAttr === lengdeKodeverkObjekt) || antallAttr === 1)
      ) {
        data[key] = data[key].kode; // eslint-disable-line no-param-reassign
        debugLogKodeverkData(data[key], key, data);
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      konverterKodeverkTilKode(data[key], erTilbakekreving, debug);
    }
  });
};
