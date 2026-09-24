import {
  behandlingfakta_hentFeilutbetalingFakta,
  kodeverk_hentAlleFeilutbetalingÅrsaker,
} from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import { describe, expect, it, vi } from 'vitest';
import { K9FeilutbetalingFaktaBackendClient } from './K9FeilutbetalingFaktaBackendClient.js';

vi.mock('@k9-sak-web/backend/k9tilbake/generated/sdk.js', () => ({
  behandlingfakta_hentFeilutbetalingFakta: vi.fn(),
  kodeverk_hentAlleFeilutbetalingÅrsaker: vi.fn(),
}));

describe('K9FeilutbetalingFaktaBackendClient', () => {
  it('bevarer manglende valgfrie faktafelt', async () => {
    const fakta: BehandlingFeilutbetalingFaktaDto = {
      behandlingFakta: {
        perioder: [{}],
      },
    };
    vi.mocked(behandlingfakta_hentFeilutbetalingFakta).mockResolvedValue({ data: fakta } as never);

    const result = await new K9FeilutbetalingFaktaBackendClient().hentFeilutbetalingFakta('behandling-uuid');

    expect(result).toEqual({ behandlingFakta: { perioder: [{}] } });
    expect(behandlingfakta_hentFeilutbetalingFakta).toHaveBeenCalledWith({
      query: { uuid: { behandlingId: 'behandling-uuid' } },
    });
  });

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

    expect(result).toEqual([
      {
        ytelseType: 'PSB',
        hendelseTyper: [
          {
            hendelseType: 'BEREGNING_TYPE',
            hendelseUndertyper: ['ENDRING_GRUNNLAG'],
          },
        ],
      },
    ]);
    expect(kodeverk_hentAlleFeilutbetalingÅrsaker).toHaveBeenCalledWith();
  });
});
