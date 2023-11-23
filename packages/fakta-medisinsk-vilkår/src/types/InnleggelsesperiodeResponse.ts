import { Period } from '@fpsak-frontend/utils';
import Link from './Link';

export interface InnleggelsesperiodeResponse {
  behandlingUuid: string;
  versjon: string;
  perioder: Period[];
  links: Link[];
}
