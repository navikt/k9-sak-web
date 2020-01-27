import Kodeverk from './kodeverk';

type FagsakPerson = Readonly<{
  alder: number,
  diskresjonskode?: Kodeverk,
  dodsdato?: string,
  erDod: boolean,
  erKvinne: boolean,
  navn: string,
  personnummer: string,
  personstatusType: Kodeverk,
}>;

export default FagsakPerson;
