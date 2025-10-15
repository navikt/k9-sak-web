import { describe, it, expect } from 'vitest';
import { harÅrsak } from './årsakUtils';
import { pleiepengerbarn_uttak_kontrakter_Årsak as Årsak } from '@k9-sak-web/backend/k9sak/generated/types.js';

describe('årsakUtils', () => {
  it('returnerer true når årsak finnes i listen', async () => {
    const liste = [Årsak.LOVBESTEMT_FERIE, Årsak.FOR_LAV_REST_PGA_ANDRE_SØKERE];
    await expect(harÅrsak(liste, Årsak.LOVBESTEMT_FERIE)).toBe(true);
  });
  it('returnerer false når årsak ikke finnes i listen', async () => {
    const liste = [Årsak.LOVBESTEMT_FERIE];
    await expect(harÅrsak(liste, Årsak.MAKS_DAGER_OVERSTEGET)).toBe(false);
  });
});
