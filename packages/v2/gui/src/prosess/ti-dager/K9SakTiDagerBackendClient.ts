import { rettFraDagEn_hentRettFraDagEnOpplysninger } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { TiDagerBackendApiType, RettFraDagEnVisningDto } from './TiDagerBackendApiType.js';

export class K9SakTiDagerBackendClient implements TiDagerBackendApiType {
  readonly backend = 'k9sak';

  async hentRettFraDagEnOpplysninger(behandlingUuid: string): Promise<RettFraDagEnVisningDto> {
    return (await rettFraDagEn_hentRettFraDagEnOpplysninger({ query: { behandlingUuid } })).data;
  }
}
