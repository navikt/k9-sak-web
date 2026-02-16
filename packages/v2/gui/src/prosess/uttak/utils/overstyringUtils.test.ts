import { k9_kodeverk_uttak_UttakArbeidType as UttakArbeidType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { describe, expect, it } from 'vitest';
import {
  erOverstyringInnenforPerioderTilVurdering,
  finnSisteSluttDatoFraPerioderTilVurdering,
  finnTidligsteStartDatoFraPerioderTilVurdering,
  formaterOverstyringAktiviteter,
} from './overstyringUtils';

describe('overstyringUtils - periodeintervall', () => {
  const perioder = ['2024-01-01/2024-01-10', '2024-02-01/2024-02-05'];

  it('matcher når overstyring overlapper helt innenfor en periode', async () => {
    const overstyring: any = { periode: { fom: '2024-01-02', tom: '2024-01-05' } };
    await expect(erOverstyringInnenforPerioderTilVurdering(overstyring, perioder)).toBe(true);
  });

  it('matcher når overstyring overlapper på kant', async () => {
    const overstyring: any = { periode: { fom: '2024-01-10', tom: '2024-01-15' } };
    await expect(erOverstyringInnenforPerioderTilVurdering(overstyring, perioder)).toBe(true);
  });

  it('finner tidligste startdato', async () => {
    const tidligste = finnTidligsteStartDatoFraPerioderTilVurdering(perioder);
    await expect(tidligste.toISOString().startsWith('2024-01-01')).toBe(true);
  });

  it('finner siste sluttdato', async () => {
    const siste = finnSisteSluttDatoFraPerioderTilVurdering(perioder);
    await expect(siste.toISOString().startsWith('2024-02-05')).toBe(true);
  });
});

describe('overstyringUtils - formaterOverstyringAktiviteter', () => {
  it('initialiserer utbetalingsgrader til 0 og kopierer identifikatorer', async () => {
    const aktiviteter: any[] = [
      { type: UttakArbeidType.ANNET, orgnr: '123', arbeidsforholdId: 'arb1' },
      { type: UttakArbeidType.KUN_YTELSE },
    ];
    const resultat = formaterOverstyringAktiviteter(aktiviteter);
    await expect(resultat).toHaveLength(2);
    await expect(resultat[0]!.utbetalingsgrad).toBe(0);
    await expect(resultat[0]!.arbeidsforhold.orgnr).toBe('123');
    await expect(resultat[1]!.arbeidsforhold.type).toBe(UttakArbeidType.KUN_YTELSE);
  });
});
