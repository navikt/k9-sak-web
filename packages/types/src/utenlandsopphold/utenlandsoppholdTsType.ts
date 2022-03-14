import KodeverkMedNavn from '../kodeverkMedNavnTsType';
import Kodeverk from '../kodeverkTsType';

type Utenlandsopphold = {
  region: string;
  periode: string;
  landkode: string;
  årsak?: KodeverkMedNavn;
};

export type UtenlandsoppholdPerioder = {
  perioder: Utenlandsopphold[];
};

export default UtenlandsoppholdPerioder;
