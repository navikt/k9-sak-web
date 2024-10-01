import { initializeDate } from '@fpsak-frontend/utils';
import type { VilkårMedPerioderDto } from '@navikt/k9-sak-typescript-client';
import { formatDate, hentAktivePerioderFraVilkar, utledInnsendtSoknadsfrist } from './utils';

describe('formatDate', () => {
  it('should format a valid date string correctly', () => {
    const result = formatDate('2023-01-01');
    expect(result).toBe('01.01.2023');
  });

  it('should handle an invalid date string', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Invalid Date');
  });

  it('should handle an empty date string', () => {
    const result = formatDate('');
    expect(result).toBe('Invalid Date');
  });
});

describe('utledInnsendtSoknadsfrist', () => {
  it('should return formatted date string for a valid date input', () => {
    const result = utledInnsendtSoknadsfrist('2023-01-01');
    expect(result).toBe('2022-10-01');
  });

  it('should return date object for a valid date input without formatting', () => {
    const result = utledInnsendtSoknadsfrist('2023-01-01', false);
    expect(result).toStrictEqual(initializeDate('2022-10-01'));
  });

  it('should handle an invalid date string', () => {
    const result = utledInnsendtSoknadsfrist('invalid-date');
    expect(result).toBe('Invalid Date');
  });
});

describe('hentAktivePerioderFraVilkar', () => {
  it('should return an empty array if there are no periods in vilkar', () => {
    const vilkar = [{ perioder: [] }];
    const result = hentAktivePerioderFraVilkar(vilkar as VilkårMedPerioderDto[], true);
    expect(result).toEqual([]);
  });

  it('should return filtered and sorted periods when visAllePerioder is true', () => {
    const vilkar = [
      {
        perioder: [
          { periode: { fom: '2023-01-01' }, vurderesIBehandlingen: false },
          { periode: { fom: '2023-02-01' }, vurderesIBehandlingen: true },
        ],
      },
    ];

    const result = hentAktivePerioderFraVilkar(vilkar as VilkårMedPerioderDto[], true);
    expect(result).toEqual([{ periode: { fom: '2023-01-01' }, vurderesIBehandlingen: false }]);
  });

  it('should return filtered and sorted periods when visAllePerioder is false', () => {
    const vilkar = [
      {
        perioder: [
          { periode: { fom: '2023-01-01' }, vurderesIBehandlingen: false },
          { periode: { fom: '2023-02-01' }, vurderesIBehandlingen: true },
        ],
      },
    ];

    const result = hentAktivePerioderFraVilkar(vilkar as VilkårMedPerioderDto[], false);
    expect(result).toEqual([{ periode: { fom: '2023-02-01' }, vurderesIBehandlingen: true }]);
  });

  it('should return sorted periods in reverse order', () => {
    const vilkar = [
      {
        perioder: [
          { periode: { fom: '2023-01-01' }, vurderesIBehandlingen: false },
          { periode: { fom: '2023-02-01' }, vurderesIBehandlingen: false },
        ],
      },
    ];

    const result = hentAktivePerioderFraVilkar(vilkar as VilkårMedPerioderDto[], true);
    expect(result).toEqual([
      { periode: { fom: '2023-02-01' }, vurderesIBehandlingen: false },
      { periode: { fom: '2023-01-01' }, vurderesIBehandlingen: false },
    ]);
  });
});
