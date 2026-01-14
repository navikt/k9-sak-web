import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';

export interface InntektsmeldingApi {
  hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering>;
}
