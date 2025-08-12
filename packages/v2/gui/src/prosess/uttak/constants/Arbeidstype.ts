import type { k9_kodeverk_uttak_UttakArbeidType } from '@k9-sak-web/backend/k9sak/generated';

export const arbeidstypeTilVisning: Record<k9_kodeverk_uttak_UttakArbeidType, string> = {
  AT: 'Arbeidstaker',
  FL: 'Frilanser',
  DP: 'Dagpenger',
  SN: 'Selvstendig næringsdrivende',
  IKKE_YRKESAKTIV: 'Ikke yrkesaktiv',
  SN_IKKE_AKTIV: 'Selvstendig næringsdrivende - Ikke aktiv',
  FL_IKKE_AKTIV: 'Frilanser - Ikke aktiv',
  BA: 'Kun ytelse',
  MIDL_INAKTIV: 'Inaktiv',
  SP_AV_DP: 'Sykepenger av dagpenger',
  IKKE_YRKESAKTIV_UTEN_ERSTATNING: 'Ikke yrkesaktiv',
  PSB_AV_DP: 'Pleiepenger av dagpenger', // Denne lå ikke i den gamle constanten, men er med i de genererte typene
  ANNET: 'Annet', // Denne lå ikke i den gamle constanten, men er med i de genererte typene
};
