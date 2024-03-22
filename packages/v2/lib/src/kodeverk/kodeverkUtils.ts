// import { KodeverkType, AlleKodeverk } from '@k9-sak-web/lib/kodeverk/';

import { AlleKodeverk, KodeverkType, KodeverkV2 } from '../types';

export const utledKodeverkNavnFraKode = (
  kode: string,
  kodeverkType: KodeverkType,
  alleKodeverk: AlleKodeverk,
): string => {
  console.log(`kodeverkNavnFrakode ${kode} (${kodeverkType})`);

  const kodeverkForType = alleKodeverk[kodeverkType];
  if (!kodeverkForType || kodeverkForType.length === 0) {
    return '';
  }

  const kodeverk = kodeverkForType.find((k: KodeverkV2) => k.kode === kode);
  console.log(`${kode} => ${kodeverk ? kodeverk.navn : 'Ukjent'} (${kodeverkType})`);
  return kodeverk ? kodeverk.navn : '';
};

export const utledKodeverkNavnFraUndertypeKode = (undertypeKode: string, kodeverkForUndertype: KodeverkV2[]) => {
  const kodeverk = kodeverkForUndertype.find((k: KodeverkV2) => k.kode === undertypeKode);
  console.log(`${undertypeKode} (Undertype) => ${kodeverk ? kodeverk.navn : 'Ukjent'}`);
  return kodeverk ? kodeverk.navn : '';
};
