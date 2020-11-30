import Kodeverk from './kodeverkTsType';

type FagsakPerson = Readonly<{
  erDod: boolean;
  navn: string;
  alder: number;
  personnummer: string;
  erKvinne: boolean;
  personstatusType: Kodeverk;
  diskresjonskode?: Kodeverk;
  dodsdato?: string;
  aktørId?: string;
}>;

export default FagsakPerson;
