import { KodeverkMedNavn } from '@k9-sak-web/types';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

/*
 * Funksjon for å slå opp et navnet/verdien til en gitt kode i et kodeverk / en gitt kodeverktype.
 * Må få alle kodeverk sendt inn som input, samt hvilket kodeverktype det gjelder og koden som skal
 * det skal gjøres oppslag på.
 */
export const getKodeverknavnFraKode = (
  alleKodeverk: { [key: string]: KodeverkMedNavn[] },
  kodeverkType: KodeverkType, // foreløpig usikker på om vi trenger undertype, beholder inntill videre
  kode: string,
  undertype?: string,
) => {
  let kodeverkForType = alleKodeverk[kodeverkType];
  if (!kodeverkForType || kodeverkForType.length === 0) {
    return '';
  }
  if (undertype) {
    kodeverkForType = kodeverkForType[undertype];
  }

  const kodeverk = kodeverkForType.find(k => k.kode === kode);
  return kodeverk ? kodeverk.navn : '';
};

/*
 * Hjelpefunksjon for hente funksjon for å gjøre oppslag i kodeverk.
 */
export const getKodeverknavnFn =
  (alleKodeverk: { [key: string]: KodeverkMedNavn[] }) => (kode: string, kodeverk: KodeverkType, undertype?: string) =>
    getKodeverknavnFraKode(alleKodeverk, kodeverk, kode, undertype);

export const konverterKodeverkTilKode = (data: any, erTilbakekreving = false) => {
  if (data === undefined || data === null) {
    return;
  }
  const lengdeKodeverkObject = erTilbakekreving ? 3 : 2;

  Object.keys(data).forEach(key => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if (
        (data[key]?.kodeverk &&
          (antallAttr === lengdeKodeverkObject || data[key]?.kodeverk === 'AVKLARINGSBEHOV_DEF')) ||
        antallAttr === 1
      ) {
        // eslint-disable-next-line no-param-reassign
        data[key] = data[key].kode;
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      konverterKodeverkTilKode(data[key], erTilbakekreving);
    }
  });
};
