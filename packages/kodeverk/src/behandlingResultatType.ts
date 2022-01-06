const behandlingResultatType = {
  IKKE_FASTSATT: 'IKKE_FASTSATT',
  INNVILGET: 'INNVILGET',
  DELVIS_INNVILGET: 'DELVIS_INNVILGET',
  INNVILGET_ENDRING: 'INNVILGET_ENDRING',
  AVSLATT: 'AVSLÅTT',
  OPPHOR: 'OPPHØR',
  KLAGE_AVVIST: 'KLAGE_AVVIST',
  KLAGE_MEDHOLD: 'KLAGE_MEDHOLD',
  KLAGE_YTELSESVEDTAK_OPPHEVET: 'KLAGE_YTELSESVEDTAK_OPPHEVET',
  KLAGE_YTELSESVEDTAK_STADFESTET: 'KLAGE_YTELSESVEDTAK_STADFESTET',
  DELVIS_MEDHOLD_I_KLAGE: 'DELVIS_MEDHOLD_I_KLAGE',
  HJEMSENDE_UTEN_OPPHEVE: 'HJEMSENDE_UTEN_OPPHEVE',
  HENLAGT_SOKNAD_TRUKKET: 'HENLAGT_SØKNAD_TRUKKET',
  HENLAGT_KLAGE_TRUKKET: 'HENLAGT_KLAGE_TRUKKET',
  HENLAGT_INNSYN_TRUKKET: 'HENLAGT_INNSYN_TRUKKET',
  HENLAGT_FEILOPPRETTET: 'HENLAGT_FEILOPPRETTET',
  HENLAGT_FEILOPPRETTET_MED_BREV: 'HENLAGT_FEILOPPRETTET_MED_BREV',
  HENLAGT_FEILOPPRETTET_UTEN_BREV: 'HENLAGT_FEILOPPRETTET_UTEN_BREV',
  HENLAGT_BRUKER_DOD: 'HENLAGT_BRUKER_DØD',
  INGEN_ENDRING: 'INGEN_ENDRING',
  MANGLER_BEREGNINGSREGLER: 'MANGLER_BEREGNINGSREGLER',
};

const innvilgetKlageResultatTyper = [
  behandlingResultatType.KLAGE_MEDHOLD,
  behandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET,
  behandlingResultatType.DELVIS_MEDHOLD_I_KLAGE,
  behandlingResultatType.HJEMSENDE_UTEN_OPPHEVE,
];

const innvilgetRevurderingResultatTyper = [
  behandlingResultatType.INNVILGET_ENDRING,
  behandlingResultatType.INGEN_ENDRING,
];

export const isInnvilget = behandlingResultatTypeKode =>
  innvilgetKlageResultatTyper.includes(behandlingResultatTypeKode) ||
  innvilgetRevurderingResultatTyper.includes(behandlingResultatTypeKode) ||
  behandlingResultatTypeKode === behandlingResultatType.INNVILGET;

export const isDelvisInnvilget = behandlingResultatTypeKode =>
  behandlingResultatTypeKode === behandlingResultatType.DELVIS_INNVILGET;

export const isAvslag = behandlingResultatTypeKode =>
  behandlingResultatTypeKode === behandlingResultatType.AVSLATT ||
  behandlingResultatTypeKode === behandlingResultatType.KLAGE_AVVIST ||
  behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET;

export const isOpphor = behandlingResultatTypeKode => behandlingResultatTypeKode === behandlingResultatType.OPPHOR;

export const isHenlagt = behandlingResultatTypeKode =>
  [
    behandlingResultatType.HENLAGT_BRUKER_DOD,
    behandlingResultatType.HENLAGT_FEILOPPRETTET,
    behandlingResultatType.HENLAGT_FEILOPPRETTET_MED_BREV,
    behandlingResultatType.HENLAGT_FEILOPPRETTET_UTEN_BREV,
    behandlingResultatType.HENLAGT_INNSYN_TRUKKET,
    behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
    behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
  ].some(type => type === behandlingResultatTypeKode);

export default behandlingResultatType;
