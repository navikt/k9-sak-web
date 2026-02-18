import { type k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type Personopplysninger = Pick<
  PersonopplysningDto,
  'navn' | 'adresser' | 'sivilstand' | 'region' | 'avklartPersonstatus' | 'personstatus' | 'annenPart'
>;
