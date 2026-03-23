import { avp_getBeregningsgrunnlag } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/api.js';
import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import type { AktivitetspengerBeregningBackendApiType } from './AktivitetspengerBeregningBackendApiType.js';

export default class AktivitetspengerBeregningBackendClient implements AktivitetspengerBeregningBackendApiType {
  async getBeregningsgrunnlag(behandlingUuid: string): Promise<BeregningsgrunnlagDto> {
    return (await avp_getBeregningsgrunnlag({ query: { behandlingUuid } })).data;
  }
}
