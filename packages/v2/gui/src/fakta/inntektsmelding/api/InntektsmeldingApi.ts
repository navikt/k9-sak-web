import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';

export interface InntektsmeldingApi {
  hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering>;
}
