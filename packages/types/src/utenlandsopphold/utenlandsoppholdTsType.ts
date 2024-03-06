import KodeverkMedNavn from '../kodeverkMedNavnTsType';

export type UtenlandsoppholdType = {
  region: string;
  periode: string;
  landkode: KodeverkMedNavn;
  årsak?: string;
};

export type UtenlandsoppholdPerioder = {
  perioder: UtenlandsoppholdType[];
};

export default UtenlandsoppholdPerioder;
