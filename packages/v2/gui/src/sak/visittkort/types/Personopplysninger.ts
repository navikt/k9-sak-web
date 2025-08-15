import type {
  k9_sak_kontrakt_person_AvklartPersonstatus as AvklartPersonstatus,
  k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto,
} from '@k9-sak-web/backend/k9sak/generated';

export type Personopplysninger = {
  navn: string;
  fnr: PersonopplysningDto['fnr'];
  navBrukerKjonn: string;
  pleietrengendePart?: {
    personstatus: string;
  };
  annenPart?: Personopplysninger;
  barnSoktFor: Personopplysninger[];
  aktoerId: string;
  fodselsdato: string;
  dodsdato?: string;
  harVerge: boolean;
  diskresjonskode: string;
  avklartPersonstatus: {
    overstyrtPersonstatus: NonNullable<AvklartPersonstatus['overstyrtPersonstatus']>;
    orginalPersonstatus: NonNullable<AvklartPersonstatus['orginalPersonstatus']>;
  };
  personstatus: NonNullable<PersonopplysningDto['personstatus']>;
  adresser: PersonopplysningDto['adresser'];
  region: PersonopplysningDto['region'];
  sivilstand: PersonopplysningDto['sivilstand'];
};
