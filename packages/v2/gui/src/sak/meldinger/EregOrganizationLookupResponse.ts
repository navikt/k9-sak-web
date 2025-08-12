import type { k9_sak_web_app_tjenester_brev_UtilgjengeligÅrsak as utilgjengeligÅrsak } from '@k9-sak-web/backend/k9sak/generated';

export interface EregOrganizationLookupResponse {
  readonly name?: string | undefined;
  readonly utilgjengelig?: utilgjengeligÅrsak;
  readonly notFound?: boolean;
  readonly invalidOrgnum?: boolean;
}
