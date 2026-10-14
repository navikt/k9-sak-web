import { behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/sdk/UttakSdk.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { K9SakUttakBackendClient } from './K9SakUttakBackendClient.js';

vi.mock('@k9-sak-web/backend/k9sak/sdk/UttakSdk.js', () => ({
  behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder: vi.fn(),
}));

const request = new Request('http://localhost/uttak');
const sdkMock = vi.mocked(behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder);

describe('K9SakUttakBackendClient.hentUttak', () => {
  beforeEach(() => {
    sdkMock.mockReset();
  });

  it.each([false, true])('returns null for a 404 (wrapped: %s)', async wrapped => {
    const apiError = new ExtendedApiError(request, new Response(null, { status: 404 }), '', null);
    sdkMock.mockRejectedValue(wrapped ? new Error('Request failed', { cause: apiError }) : apiError);

    await expect(new K9SakUttakBackendClient().hentUttak('behandlingUuid')).resolves.toBeNull();
  });

  it.each([new ExtendedApiError(request, new Response(null, { status: 500 }), '', null), new Error('Network error')])(
    'rethrows other errors unchanged',
    async error => {
      sdkMock.mockRejectedValue(error);

      await expect(new K9SakUttakBackendClient().hentUttak('behandlingUuid')).rejects.toBe(error);
    },
  );

  it('returns validated data', async () => {
    const data = { uttaksplan: { kvoteInfo: { totaltForbruktKvote: 0 } }, simulertUttaksplan: {} };
    sdkMock.mockResolvedValue({ data, request, response: new Response() });

    await expect(new K9SakUttakBackendClient().hentUttak('behandlingUuid')).resolves.toBe(data);
    expect(sdkMock).toHaveBeenCalledWith({ query: { behandlingUuid: 'behandlingUuid' } });
  });

  it('propagates validation errors', async () => {
    const data = { uttaksplan: { kvoteInfo: {} }, simulertUttaksplan: {} };
    sdkMock.mockResolvedValue({ data, request, response: new Response() });

    await expect(new K9SakUttakBackendClient().hentUttak('behandlingUuid')).rejects.toThrow(
      'Utviklerfeil: Totalt forbrukt kvote er undefined',
    );
  });
});
