import type { Period } from '@fpsak-frontend/utils';
import type Link from './Link';

export interface InnleggelsesperiodeResponse {
  behandlingUuid: string;
  versjon: string;
  perioder: Period[];
  links: Link[];
}
