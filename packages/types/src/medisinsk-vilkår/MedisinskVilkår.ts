export interface Periode {
  fom: Date | string;
  tom: Date | string;
}

// eslint-disable-next-line
export enum LegeerklæringKilde {
  SYKEHUSLEGE = 'SYKEHUSLEGE',
  SPESIALISTHELSETJENESTEN = 'SPESIALISTHELSETJENESTEN',
  FASTLEGE = 'FASTLEGE',
  ANNEN_YRKESGRUPPE = 'ANNEN_YRKESGRUPPE',
}

const diagnosekode = 'diagnosekode';

export interface Legeerklæring {
  [diagnosekode]: string;
  kilde: LegeerklæringKilde;
  fom: string;
  tom: string;
  innleggelsesperioder: Periode[];
  identifikator: string;
}

export interface PeriodeMedTilsynOgPleie extends Periode {
  begrunnelse: string;
  behovForToOmsorgspersoner: string;
  perioderMedUtvidetKontinuerligTilsynOgPleie: PeriodeMedUtvidetTilsynOgPleie[];
}

export interface PeriodeMedTilsynOgPleieResponse {
  periode: Periode;
  begrunnelse: string;
}

export interface PeriodeMedUtvidetTilsynOgPleie extends Periode {
  begrunnelse: string;
}

export interface Pleiebehov {
  perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleie[];
}

export interface MedisinskVilkår {
  legeerklæring: Legeerklæring;
  pleiebehov: Pleiebehov;
}

interface Diagnosekode {
  key: string;
  value: string;
}

export interface TransformValues {
  begrunnelse: string;
  diagnosekode?: Diagnosekode;
  erInnlagt: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  harDiagnose: boolean;
  innleggelsesperioder?: Periode[];
  legeerklaeringkilde: string;
  legeerklæringFom: string;
  legeerklæringTom: string;
  perioderMedKontinuerligTilsynOgPleie?: PeriodeMedTilsynOgPleie[];
}

export interface Sykdom {
  periodeTilVurdering: Periode;
  legeerklæringer: Legeerklæring[];
  perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleieResponse[];
  perioderMedUtvidetKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleieResponse[];
}
