export type UtenlandsoppholdType = {
  region: string;
  periode: string;
  landkode: string;
  årsak?: string;
};

export type UtenlandsoppholdPerioder = {
  perioder: UtenlandsoppholdType[];
};

export default UtenlandsoppholdPerioder;
