import KodeverkMedNavn from '../kodeverkMedNavnTsType';
import Kodeverk from '../kodeverkTsType';

export type UtenlandsoppholdType = {
  region: Kodeverk;
  periode: string;
  landkode: KodeverkMedNavn;
  årsak?: string;
};

export type UtenlandsoppholdPerioder = {
  perioder: UtenlandsoppholdType[];
};

export default UtenlandsoppholdPerioder;
