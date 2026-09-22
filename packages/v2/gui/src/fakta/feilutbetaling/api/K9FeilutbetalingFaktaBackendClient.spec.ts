import { kodeverk_hentAlleFeilutbetalingÅrsaker } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import { describe, expect, it, vi } from 'vitest';
import { K9FeilutbetalingFaktaBackendClient } from './K9FeilutbetalingFaktaBackendClient.js';

vi.mock('@k9-sak-web/backend/k9tilbake/generated/sdk.js', () => ({
  behandlingfakta_hentFeilutbetalingFakta: vi.fn(),
  kodeverk_hentAlleFeilutbetalingÅrsaker: vi.fn(),
}));

describe('K9FeilutbetalingFaktaBackendClient', () => {
  it('accepts an array response from the reason endpoint', async () => {
    const årsaker: HendelseTyperPrYtelseTypeDto[] = [
      {
        ytelseType: 'PSB',
        hendelseTyper: [
          {
            hendelseType: 'BEREGNING_TYPE',
            hendelseUndertyper: ['ENDRING_GRUNNLAG'],
          },
        ],
      },
    ];
    vi.mocked(kodeverk_hentAlleFeilutbetalingÅrsaker).mockResolvedValue({ data: årsaker } as never);

    const result = await new K9FeilutbetalingFaktaBackendClient().hentFeilutbetalingÅrsaker();

    expect(result).toEqual(årsaker);
    expect(kodeverk_hentAlleFeilutbetalingÅrsaker).toHaveBeenCalledWith();
  });

  it('rejects a non-array response from the reason endpoint', async () => {
    vi.mocked(kodeverk_hentAlleFeilutbetalingÅrsaker).mockResolvedValue({ data: {} } as never);

    await expect(new K9FeilutbetalingFaktaBackendClient().hentFeilutbetalingÅrsaker()).rejects.toThrow(
      'Feilutbetaling årsaker-endepunktet returnerte ikke en liste',
    );
  });
});
