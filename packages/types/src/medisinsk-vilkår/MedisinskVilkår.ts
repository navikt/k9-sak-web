interface Periode {
  fom: Date;
  tom: Date;
}

// eslint-disable-next-line
export enum LegeerklæringKilde {
  SYKEHUSLEGE = 'SYKEHUSLEGE',
  SPESIALISTHELSETJENESTEN = 'SPESIALISTHELSETJENESTEN',
  FASTLEGE = 'FASTLEGE',
  ANNEN_YRKESGRUPPE = 'ANNEN_YRKESGRUPPE'
}

const diagnosekode = 'diagnosekode';

export interface Legeerklæring {
  [diagnosekode]: string;
  kilde: LegeerklæringKilde;
  gjelderForPeriode: Periode;
  innleggelsesperioder: Periode[];

}

export interface PeriodeMedTilsynOgPleie extends Periode {
  begrunnelse: string;
}

export interface Pleiebehov {
  perioderMedTilsynOgPleie: PeriodeMedTilsynOgPleie[];
  perioderMedUtvidetTilsynOgPleie: PeriodeMedTilsynOgPleie[];
}

export interface MedisinskVilkår {
  legeerklæring: Legeerklæring;
  pleiebehov: Pleiebehov;
}
