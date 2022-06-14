import { KodeverkMedNavn, Kodeverk } from '@k9-sak-web/types';
import KodeverkType from 'kodeverk/src/kodeverkTyper';

export const getKodeverknavnFraKode = (
  alleKodeverk: { [key: string]: KodeverkMedNavn[] },
  kodeverkType: KodeverkType,
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
  alleKodeverk: { [key: string]: KodeverkMedNavn[] }
) => (kode: string, kodeverk: KodeverkType, undertype?: string) =>
    getKodeverknavnFraKode(alleKodeverk, kodeverk, kode, undertype);
