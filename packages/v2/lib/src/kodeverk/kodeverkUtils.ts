import {
  AlleKodeverk,
  KodeverkType,
  KodeverkV2,
  KodeverkKlageType,
  KodeverkMedUndertype,
  KodeverkTilbakeType,
} from '../types';

export const utledKodeverkNavnFraKode = (
  kode: string,
  kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
  alleKodeverk: AlleKodeverk,
  ukjentTekst?: string | undefined,
): string => {
  // console.log(`kodeverkNavnFrakode ${kode} (${kodeverkType})`);

  const kodeverkForType: KodeverkV2[] | KodeverkMedUndertype = alleKodeverk[kodeverkType] || [];
  if (!kodeverkForType || kodeverkForType.length === 0) {
    return '';
  }

  if (Array.isArray(kodeverkForType)) {
    const kodeverk = kodeverkForType.find((k: KodeverkV2) => typeof k !== 'string' && k.kode === kode);
    // console.log(`${kode} => ${kodeverk ? kodeverk.navn : 'Ukjent'} (${kodeverkType})`);
    return kodeverk && typeof kodeverk !== 'string' ? kodeverk.navn : ukjentTekst || 'Ukjent kodeverk';
  }

  return ukjentTekst || 'Ukjent kodeverk';
};

export const utledKodeverkNavnFraUndertypeKode = (
  undertypeKode: string,
  kodeverkForUndertype: KodeverkV2[],
  ukjentTekst: string | undefined = 'Ukjent kodeverk',
) => {
  const kodeverk = kodeverkForUndertype.find((k: KodeverkV2) => typeof k !== 'string' && k.kode === undertypeKode);
  // console.log(`${undertypeKode} (Undertype) => ${kodeverk ? kodeverk.navn : 'Ukjent'}`);
  return kodeverk && typeof kodeverk !== 'string' ? kodeverk.navn : ukjentTekst || 'Ukjent kodeverk';
};
