import { Period } from '@navikt/k9-fe-period-utils';
import Link from './Link';

export interface InnleggelsesperiodeResponse {
  behandlingUuid: string;
  versjon: string;
  perioder: Period[];
  links: Link[];
}
