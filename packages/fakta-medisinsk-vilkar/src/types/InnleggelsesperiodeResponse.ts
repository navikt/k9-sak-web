import { Period } from '@navikt/k9-period-utils';
import Link from './Link';

export interface InnleggelsesperiodeResponse {
    behandlingUuid: string;
    versjon: string;
    perioder: Period[];
    links: Link[];
}
