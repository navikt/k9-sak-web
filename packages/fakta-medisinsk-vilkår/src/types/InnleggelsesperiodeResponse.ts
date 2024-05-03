import { Period } from '@k9-sak-web/utils';
import Link from './Link';

export interface InnleggelsesperiodeResponse {
  behandlingUuid: string;
  versjon: string;
  perioder: Period[];
  links: Link[];
}
