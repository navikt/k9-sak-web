import type { k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type Personopplysninger = {
  aktoerId?: PersonopplysningDto['aktoerId'];
  navn: PersonopplysningDto['navn'];
  fnr?: PersonopplysningDto['fnr'];
  nummer?: PersonopplysningDto['nummer'];
};
