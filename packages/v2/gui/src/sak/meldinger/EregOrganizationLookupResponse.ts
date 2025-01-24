import type { BrevMottakerinfoEregResponseDtoUtilgjengeligÅrsak as utilgjengeligÅrsak } from '@k9-sak-web/backend/k9sak/generated';

export interface EregOrganizationLookupResponse {
  readonly name?: string | undefined;
  readonly utilgjengelig?: utilgjengeligÅrsak;
  readonly notFound?: boolean;
  readonly invalidOrgnum?: boolean;
}
