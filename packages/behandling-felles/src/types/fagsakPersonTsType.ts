import { Kodeverk } from '@k9-sak-web/types';

type FagsakPerson = Readonly<{
  alder: number;
  diskresjonskode?: Kodeverk;
  dodsdato?: string;
  erDod: boolean;
  erKvinne: boolean;
  navn: string;
  personnummer: string;
  personstatusType: Kodeverk;
  aktørId?: string;
}>;

export default FagsakPerson;
