export interface Uttak {
  id: number;
  hovedsoker: boolean;
  group: number;
  fom: string;
  tom: string;
  periodeResultatType: Type;
  aktiviteter: Aktiviteter[];
  erSlettet: boolean;
  erLagtTil: boolean;
  erEndret: boolean;
}

export interface Aktiviteter {
  stønadskontoType: Type;
}

export interface Type {
  kode: string;
  navn: string;
  kodeverk: string;
}
