import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/generated';

export type Personopplysninger = {
  aktoerId?: PersonopplysningDto['aktoerId'];
  navn: PersonopplysningDto['navn'];
  fnr?: PersonopplysningDto['fnr'];
  nummer?: PersonopplysningDto['nummer'];
};
