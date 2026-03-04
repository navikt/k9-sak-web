import type { utilgjengeligÅrsak } from '@k9-sak-web/backend/k9sak/tjenester/brev/utilgjengeligÅrsak.js';

export interface EregOrganizationLookupResponse {
  readonly name?: string | undefined;
  readonly utilgjengelig?: utilgjengeligÅrsak;
  readonly notFound?: boolean;
  readonly invalidOrgnum?: boolean;
}
