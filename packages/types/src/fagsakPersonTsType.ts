export type FagsakPerson = Readonly<{
  erDod: boolean;
  navn: string;
  alder: number;
  personnummer: string;
  erKvinne: boolean;
  personstatusType: string;
  diskresjonskode?: string;
  dodsdato?: string;
  aktørId?: string;
}>;

export default FagsakPerson;
