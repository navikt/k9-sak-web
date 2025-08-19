import { k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto } from '@navikt/k9-sak-typescript-client';

export type Personopplysninger = Pick<
  PersonopplysningDto,
  'navn' | 'adresser' | 'sivilstand' | 'region' | 'avklartPersonstatus' | 'personstatus' | 'annenPart'
>;
