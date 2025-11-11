import { Period } from '@fpsak-frontend/utils';
import { k9_sak_kontrakt_ResourceLink } from '@navikt/k9-sak-typescript-client/types';

export interface InnleggelsesperiodeResponse {
  behandlingUuid: string;
  versjon?: string;
  perioder?: Period[];
  links?: Array<k9_sak_kontrakt_ResourceLink>;
}
