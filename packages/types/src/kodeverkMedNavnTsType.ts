import Kodeverk from "./kodeverkTsType";

export type KodeverkMedNavn = Kodeverk & Readonly<{
  navn: string;
}>;

export default KodeverkMedNavn;
