import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagDto as Feriepengegrunnlag } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { beregningsresultat_hentFeriepengegrunnlag } from '@k9-sak-web/backend/k9sak/generated/sdk.js';

export default class TilkjentYtelseBackendClient {
  async hentFeriepengegrunnlag(behandlingUuid: string): Promise<Feriepengegrunnlag | null> {
    return (await beregningsresultat_hentFeriepengegrunnlag({ query: { behandlingUuid } })).data ?? null;
  }
}
