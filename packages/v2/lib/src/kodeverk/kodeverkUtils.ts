import { KodeverkV2, KodeverkMedUndertype } from '../types';

export const utledKodeverkNavnFraKode = (
  kode: string,
  kodeverkForType: KodeverkV2[] | KodeverkMedUndertype,
  ukjentTekst?: string | undefined,
): string => {
  if (Array.isArray(kodeverkForType)) {
    const kodeverk = kodeverkForType.find((k: KodeverkV2) => typeof k !== 'string' && k.kode === kode);
    return kodeverk && typeof kodeverk !== 'string' ? kodeverk.navn : ukjentTekst || 'Ukjent kodeverk';
  }

  return ukjentTekst || 'Ukjent kodeverk';
};

export const utledKodeverkNavnFraUndertypeKode = (
  undertypeKode: string,
  kodeverkForUndertype: KodeverkV2[] | KodeverkMedUndertype,
  ukjentTekst: string | undefined = 'Ukjent kodeverk',
) => {
  if (Array.isArray(kodeverkForUndertype)) {
    const undertypeKodeverk = kodeverkForUndertype.find(
      (k: KodeverkV2) => typeof k !== 'string' && k.kode === undertypeKode,
    );

    return undertypeKodeverk && typeof undertypeKodeverk !== 'string'
      ? undertypeKodeverk.navn
      : ukjentTekst || 'Ukjent kodeverk';
  }

  return ukjentTekst || 'Ukjent kodeverk';
};
