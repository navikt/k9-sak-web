import {
  behandlingfakta_hentFeilutbetalingFakta,
  kodeverk_hentAlleFeilutbetalingÅrsaker,
} from '@k9-sak-web/backend/ungtilbake/api/feilutbetaling.js';
import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import { describe, expect, it, vi } from 'vitest';
import { UngFeilutbetalingFaktaBackendClient } from './UngFeilutbetalingFaktaBackendClient.js';

vi.mock('@k9-sak-web/backend/ungtilbake/api/feilutbetaling.js', () => ({
  behandlingfakta_hentFeilutbetalingFakta: vi.fn(),
  kodeverk_hentAlleFeilutbetalingÅrsaker: vi.fn(),
}));

describe('UngFeilutbetalingFaktaBackendClient', () => {
  it('returnerer fakta som er kompatible med den felles visningsmodellen', async () => {
    const fakta: BehandlingFeilutbetalingFaktaDto = {
      behandlingFakta: {
        aktuellFeilUtbetaltBeløp: 1000,
        datoForRevurderingsvedtak: '2024-03-01',
        perioder: [
          {
            belop: 1000,
            feilutbetalingÅrsakDto: {
              hendelseType: 'BEREGNING_TYPE',
              hendelseUndertype: 'ENDRING_GRUNNLAG',
            },
            fom: '2024-01-01',
            tom: '2024-01-31',
          },
        ],
        totalPeriodeFom: '2024-01-01',
        totalPeriodeTom: '2024-01-31',
      },
    };
    vi.mocked(behandlingfakta_hentFeilutbetalingFakta).mockResolvedValue({ data: fakta } as never);

    const result = await new UngFeilutbetalingFaktaBackendClient().hentFeilutbetalingFakta('behandling-uuid');

    expect(result).toEqual(fakta);
    expect(behandlingfakta_hentFeilutbetalingFakta).toHaveBeenCalledWith({
      query: { behandlingUuid: 'behandling-uuid' },
    });
  });

  it('håndterer en liste med årsaker fra årsaksendepunktet', async () => {
    const årsaker: HendelseTyperPrYtelseTypeDto[] = [
      {
        ytelseType: 'UNG' as const,
        hendelseTyper: [
          {
            hendelseType: 'BEREGNING_TYPE' as const,
            hendelseUndertyper: ['ENDRING_GRUNNLAG' as const],
          },
        ],
      },
    ];
    vi.mocked(kodeverk_hentAlleFeilutbetalingÅrsaker).mockResolvedValue({ data: årsaker } as never);

    const result = await new UngFeilutbetalingFaktaBackendClient().hentFeilutbetalingÅrsaker();

    expect(result).toEqual([
      {
        ytelseType: 'UNG',
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
