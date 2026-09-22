import { describe, expect, it } from 'vitest';
import { deduplicateConsecutiveErrors } from './deduplicateConsecutiveErrors.js';
import { AppError } from '../AppError.js';

describe('deduplicateConsecutiveErrors', () => {
  it('returnerer ein tom liste når input er tom', () => {
    expect(deduplicateConsecutiveErrors([])).toEqual([]);
  });

  it('fjernar påfølgjande feil med same type, tittel og errorInfo, og beheld den siste', () => {
    const first = new AppError({ message: 'Same feil' });
    const second = new AppError({ message: 'Same feil' });

    const result = deduplicateConsecutiveErrors([first, second]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(second);
  });

  it('beheld feil som er ulike', () => {
    const first = new AppError({ message: 'Feil A' });
    const second = new AppError({ message: 'Feil B' });

    const result = deduplicateConsecutiveErrors([first, second]);

    expect(result).toEqual([first, second]);
  });

  it('dedupliserer berre påfølgjande feil, ikkje like feil som ikkje er ved sida av kvarandre', () => {
    const a1 = new AppError({ message: 'Feil A' });
    const b = new AppError({ message: 'Feil B' });
    const a2 = new AppError({ message: 'Feil A' });

    const result = deduplicateConsecutiveErrors([a1, b, a2]);

    expect(result).toEqual([a1, b, a2]);
  });

  it('kollapsar ei lengre gruppe av like påfølgjande feil til den siste', () => {
    const a1 = new AppError({ message: 'Feil A' });
    const a2 = new AppError({ message: 'Feil A' });
    const a3 = new AppError({ message: 'Feil A' });
    const b = new AppError({ message: 'Feil B' });

    const result = deduplicateConsecutiveErrors([a1, a2, a3, b]);

    expect(result).toEqual([a3, b]);
  });

  it('skil mellom feil med ulik tittel sjølv om dei er av same type', () => {
    const first = new AppError({ title: 'Tittel 1', message: 'Same melding' });
    const second = new AppError({ title: 'Tittel 2', message: 'Same melding' });

    const result = deduplicateConsecutiveErrors([first, second]);

    expect(result).toEqual([first, second]);
  });
});
