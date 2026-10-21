import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import { avp_getBeregningsgrunnlag } from '@k9-sak-web/backend/ungsak/sdk/AktivitetspengerSdk.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AktivitetspengerBackendClient } from './AktivitetspengerBackendClient.js';

vi.mock('@k9-sak-web/backend/ungsak/sdk/AktivitetspengerSdk.js', () => ({
  avp_getBeregningsgrunnlag: vi.fn(),
}));

const request = new Request('http://localhost/ung/sak/api/aktivitetspenger/beregningsgrunnlag');

type BeregningsgrunnlagSvar = Awaited<ReturnType<typeof avp_getBeregningsgrunnlag>>;

describe('AktivitetspengerBackendClient', () => {
  describe('getBeregningsgrunnlag', () => {
    beforeEach(() => {
      vi.mocked(avp_getBeregningsgrunnlag).mockReset();
    });

    it('returnerer beregningsgrunnlag ved 200', async () => {
      const beregningsgrunnlag = { beregningsgrunnlag: 100000 } as BeregningsgrunnlagDto;
      vi.mocked(avp_getBeregningsgrunnlag).mockResolvedValue({
        data: beregningsgrunnlag,
        request,
        response: new Response(JSON.stringify(beregningsgrunnlag), { status: 200 }),
      } as BeregningsgrunnlagSvar);

      const resultat = await new AktivitetspengerBackendClient().getBeregningsgrunnlag('behandling-uuid');

      expect(resultat).toEqual(beregningsgrunnlag);
      expect(avp_getBeregningsgrunnlag).toHaveBeenCalledWith({ query: { behandlingUuid: 'behandling-uuid' } });
    });

    it('returnerer null ved 204 når generert klient gir ReadableStream som data', async () => {
      // 204 uten Content-Type tolkes som stream av generert klient
      const response = new Response(null, { status: 204 });
      vi.mocked(avp_getBeregningsgrunnlag).mockResolvedValue({
        data: new ReadableStream(),
        request,
        response,
      } as unknown as BeregningsgrunnlagSvar);

      const resultat = await new AktivitetspengerBackendClient().getBeregningsgrunnlag('behandling-uuid');

      expect(resultat).toBeNull();
    });

    it('returnerer null ved 204 når generert klient gir tomt objekt som data', async () => {
      vi.mocked(avp_getBeregningsgrunnlag).mockResolvedValue({
        data: {},
        request,
        response: new Response(null, { status: 204 }),
      } as unknown as BeregningsgrunnlagSvar);

      const resultat = await new AktivitetspengerBackendClient().getBeregningsgrunnlag('behandling-uuid');

      expect(resultat).toBeNull();
    });

    it('returnerer null når 200 mangler data', async () => {
      vi.mocked(avp_getBeregningsgrunnlag).mockResolvedValue({
        data: undefined,
        request,
        response: new Response(null, { status: 200 }),
      } as unknown as BeregningsgrunnlagSvar);

      const resultat = await new AktivitetspengerBackendClient().getBeregningsgrunnlag('behandling-uuid');

      expect(resultat).toBeNull();
    });
  });
});
