import { KodeverkMedNavn, Kodeverk } from '@k9-sak-web/types';

export const getKodeverknavnFraKode = (
  alleKodeverk: { [key: string]: KodeverkMedNavn[] },
  kodeverkType: string,
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
export const getKodeverknavnFn = (
  alleKodeverk: { [key: string]: KodeverkMedNavn[] },
  kodeverkTyper: { [key: string]: string },
) => (kodeverkOjekt: Kodeverk, undertype?: string) =>
  getKodeverknavnFraKode(alleKodeverk, kodeverkTyper[kodeverkOjekt.kodeverk], kodeverkOjekt.kode, undertype);


export const konverterKodeverkTilKode = (data: any, erTilbakekreving = false) => {
  if (data === undefined || data === null) {
    return;
  }
  const lengdeKodeverkObject = erTilbakekreving ? 3 : 2;

  Object.keys(data).forEach((key) => {
    if (data[key]?.kode) {
      const antallAttr = Object.keys(data[key]).length;
      if ((data[key]?.kodeverk && (antallAttr === lengdeKodeverkObject || data[key]?.kodeverk === 'AVKLARINGSBEHOV_DEF')) || antallAttr === 1 ) {
        data[key] = data[key].kode;
      }
    }
    if (typeof data[key] === 'object' && data[key] !== null) {
      konverterKodeverkTilKode(data[key], erTilbakekreving);
    }
  });

}
