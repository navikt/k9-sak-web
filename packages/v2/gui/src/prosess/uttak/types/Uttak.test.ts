import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { validerUttak, type Uttak } from './Uttak.js';

describe('validerUttak', () => {
  it.each([0, 20])('accepts a defined quota of %s and narrows the type', totaltForbruktKvote => {
    const uttak: UttaksplanMedUtsattePerioder = {
      uttaksplan: { kvoteInfo: { totaltForbruktKvote } },
      simulertUttaksplan: {},
    };

    validerUttak(uttak);

    expectTypeOf(uttak).toExtend<Uttak>();
    expectTypeOf(uttak.uttaksplan.kvoteInfo?.totaltForbruktKvote).toEqualTypeOf<number | undefined>();
    if (uttak.uttaksplan.kvoteInfo) {
      expectTypeOf(uttak.uttaksplan.kvoteInfo.totaltForbruktKvote).toEqualTypeOf<number>();
    }
    expect(uttak.uttaksplan.kvoteInfo?.totaltForbruktKvote).toBe(totaltForbruktKvote);
  });

  it('accepts an absent kvoteInfo', () => {
    const uttak: UttaksplanMedUtsattePerioder = {
      uttaksplan: {},
      simulertUttaksplan: {},
    };

    expect(() => validerUttak(uttak)).not.toThrow();
  });

  it('accepts a null uttaksplan', () => {
    const uttak = {
      uttaksplan: null,
      simulertUttaksplan: {},
    } satisfies Omit<UttaksplanMedUtsattePerioder, 'uttaksplan'> & { uttaksplan: null };

    validerUttak(uttak);

    expect(uttak.uttaksplan).toBeNull();
    expectTypeOf(uttak).toExtend<Uttak>();
    expectTypeOf(uttak.uttaksplan).toEqualTypeOf<null>();
  });

  it('rejects kvoteInfo without totaltForbruktKvote', () => {
    const uttak: UttaksplanMedUtsattePerioder = {
      uttaksplan: { kvoteInfo: {} },
      simulertUttaksplan: {},
    };

    expect(() => validerUttak(uttak)).toThrow('Utviklerfeil: Totalt forbrukt kvote er undefined');
  });
});
