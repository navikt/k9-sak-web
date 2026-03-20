import type { InntekterDto } from '@k9-sak-web/backend/k9sak/kontrakt/opptjening/InntekterDto.js';

export interface InntektOgYtelseApi {
  hentInntekter(behandlingUuid: string): Promise<InntekterDto>;
}
