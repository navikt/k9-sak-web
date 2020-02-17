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
}

export interface Pleiebehov {
  perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleie[];
  perioderMedUtvidetKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleie[];
}

export interface MedisinskVilkår {
  legeerklæring: Legeerklæring;
  pleiebehov: Pleiebehov;
}

export interface TransformValues {
  begrunnelse: string;
  diagnosekode?: string;
  erInnlagt: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  harDiagnose: boolean;
  innleggelsesperioder?: Periode[];
  legeerklaeringkilde: string;
  legeerklæringFom: string;
  legeerklæringTom: string;
  perioderMedKontinuerligTilsynOgPleie?: PeriodeMedTilsynOgPleie[];
  perioderMedUtvidetKontinuerligTilsynOgPleie?: Periode[];
}

export interface Sykdom {
  legeerklæringer: Legeerklæring[];
  perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleie[];
  perioderMedUtvidetKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleie[];
}
