import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/generated';

export type Personopplysninger = Pick<
  PersonopplysningDto,
  'navn' | 'adresser' | 'sivilstand' | 'region' | 'avklartPersonstatus' | 'personstatus' | 'annenPart'
>;
