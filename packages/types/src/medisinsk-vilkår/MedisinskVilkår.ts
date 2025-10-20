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

interface PeriodeMedTilsynOgPleie extends Periode {
  begrunnelse: string;
  behovForToOmsorgspersoner: string;
  perioderMedUtvidetKontinuerligTilsynOgPleie?: PeriodeMedUtvidetTilsynOgPleie;
  begrunnelseUtvidet: string;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  sammenhengMellomSykdomOgTilsyn: boolean;
  sammenhengMellomSykdomOgTilsynBegrunnelse: string;
}

export interface PeriodeMedTilsynOgPleieResponse {
  periode: Periode;
  begrunnelse: string;
  årsaksammenheng: boolean;
  årsaksammenhengBegrunnelse: string;
}

interface PeriodeMedUtvidetTilsynOgPleie extends Periode {
  begrunnelse?: string;
}

export interface PeriodeMedUtvidetTilsynOgPleieResponse {
  begrunnelse: string;
  periode: Periode;
}

interface Pleiebehov {
  perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleie[];
}

interface MedisinskVilkår {
  legeerklæring: Legeerklæring;
  pleiebehov: Pleiebehov;
}

interface Diagnosekode {
  key: string;
  value: string;
}

interface TransformValues {
  diagnosekode?: Diagnosekode;
  innleggelsesperiode?: Periode;
  legeerklaeringkilde: string;
  legeerklæringFom: string;
  perioderMedKontinuerligTilsynOgPleie?: PeriodeMedTilsynOgPleie[];
}
