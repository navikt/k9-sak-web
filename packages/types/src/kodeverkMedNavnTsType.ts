import Kodeverk from "./kodeverkTsType";

type KodeverkMedNavn = Kodeverk & Readonly<{
  navn: string;
}>;

export default KodeverkMedNavn;
