import { describe, expect, it } from 'vitest';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';
import { feilutbetalingFaktaQueryOptions, feilutbetalingÅrsakerQueryOptions } from './FeilutbetalingFaktaQueries.js';

const api = {
  backend: 'k9tilbake',
  hentFeilutbetalingFakta: async () => undefined,
  hentFeilutbetalingÅrsaker: async () => [],
} satisfies FeilutbetalingFaktaApi;

describe('feilutbetalingFaktaQueryOptions', () => {
  it('skiller fakta per behandlingsversjon', () => {
    expect(feilutbetalingFaktaQueryOptions(api, 'behandling-uuid', 1).queryKey).toEqual([
      'feilutbetaling-fakta',
      'behandling-uuid',
      1,
      'k9tilbake',
    ]);
    expect(feilutbetalingFaktaQueryOptions(api, 'behandling-uuid', 2).queryKey).toEqual([
      'feilutbetaling-fakta',
      'behandling-uuid',
      2,
      'k9tilbake',
    ]);
  });

  it('deler årsaksoppslag på tvers av behandlingsversjoner', () => {
    expect(feilutbetalingÅrsakerQueryOptions(api).queryKey).toEqual(['feilutbetaling-aarsaker', 'k9tilbake']);
  });
});
