import KodeverkMedNavn from '../kodeverkMedNavnTsType';
import Kodeverk from '../kodeverkTsType';

type Utenlandsopphold = {
  region: Kodeverk;
  periode: string;
  landkode: KodeverkMedNavn;
  årsak?: KodeverkMedNavn;
};

export type UtenlandsoppholdPerioder = {
  perioder: Utenlandsopphold[];
};

export default UtenlandsoppholdPerioder;
