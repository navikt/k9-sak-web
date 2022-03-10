import Kodeverk from "./kodeverkTsType";

export type KodeverkMedNavn = Kodeverk & Readonly<{
  kode: string;
  navn: string;
  kodeverk: string;
}>;

export default KodeverkMedNavn;
