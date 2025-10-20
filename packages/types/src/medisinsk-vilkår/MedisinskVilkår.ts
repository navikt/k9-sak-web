export interface Periode {
  fom: Date | string;
  tom: Date | string;
}

// eslint-disable-next-line
enum LegeerklæringKilde {
  SYKEHUSLEGE = 'SYKEHUSLEGE',
  SPESIALISTHELSETJENESTEN = 'SPESIALISTHELSETJENESTEN',
  FASTLEGE = 'FASTLEGE',
  ANNEN_YRKESGRUPPE = 'ANNEN_YRKESGRUPPE',
}

export interface Legeerklæring {
  diagnosekode: string;
  kilde: LegeerklæringKilde;
  fom: string;
  tom: string;
  innleggelsesperioder: Periode[];
  identifikator: string;
}

export interface PeriodeMedTilsynOgPleieResponse {
  periode: Periode;
  begrunnelse: string;
  årsaksammenheng: boolean;
  årsaksammenhengBegrunnelse: string;
}

export interface PeriodeMedUtvidetTilsynOgPleieResponse {
  begrunnelse: string;
  periode: Periode;
}
