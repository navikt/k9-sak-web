import { opptjening_getInntekt } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { InntekterDto } from '@k9-sak-web/backend/k9sak/kontrakt/opptjening/InntekterDto.js';
import type { InntektOgYtelseApi } from './InntektOgYtelseApi.js';

// Merk: OpenAPI-spesifikasjonen har feil returtype for dette endepunktet. Den faktiske responsen er InntekterDto.
export class K9InntektOgYtelseBackendClient implements InntektOgYtelseApi {
  async hentInntekter(behandlingUuid: string): Promise<InntekterDto> {
    const response = await opptjening_getInntekt({
      query: { behandlingUuid },
    });
    return response.data as unknown as InntekterDto;
  }
}
