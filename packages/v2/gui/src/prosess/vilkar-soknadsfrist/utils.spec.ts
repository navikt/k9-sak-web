import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import initializeDate from '@k9-sak-web/lib/dateUtils/initializeDate.js';
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
    const result = hentAktivePerioderFraVilkar(vilkar, true);
    expect(result).toEqual([]);
  });

  it('should return filtered and sorted periods when visAllePerioder is true', () => {
    const vilkar = [
      {
        perioder: [
          {
            periode: { fom: '2023-01-01', tom: '' },
            vurderesIBehandlingen: false,
            vilkarStatus: vilkårStatus.IKKE_VURDERT,
          },
          {
            periode: { fom: '2023-02-01', tom: '' },
            vurderesIBehandlingen: true,
            vilkarStatus: vilkårStatus.IKKE_VURDERT,
          },
        ],
      },
    ];

    const result = hentAktivePerioderFraVilkar(vilkar, true);
    expect(result).toEqual([
      {
        periode: { fom: '2023-01-01', tom: '' },
        vurderesIBehandlingen: false,
        vilkarStatus: vilkårStatus.IKKE_VURDERT,
      },
    ]);
  });

  it('should return filtered and sorted periods when visAllePerioder is false', () => {
    const vilkar = [
      {
        perioder: [
          {
            periode: { fom: '2023-01-01', tom: '' },
            vurderesIBehandlingen: false,
            vilkarStatus: vilkårStatus.IKKE_VURDERT,
          },
          {
            periode: { fom: '2023-02-01', tom: '' },
            vurderesIBehandlingen: true,
            vilkarStatus: vilkårStatus.IKKE_VURDERT,
          },
        ],
      },
    ];

    const result = hentAktivePerioderFraVilkar(vilkar, false);
    expect(result).toEqual([
      { periode: { fom: '2023-02-01', tom: '' }, vurderesIBehandlingen: true, vilkarStatus: vilkårStatus.IKKE_VURDERT },
    ]);
  });

  it('should return sorted periods in reverse order', () => {
    const vilkar = [
      {
        perioder: [
          {
            periode: { fom: '2023-01-01', tom: '' },
            vurderesIBehandlingen: false,
            vilkarStatus: vilkårStatus.IKKE_VURDERT,
          },
          {
            periode: { fom: '2023-02-01', tom: '' },
            vurderesIBehandlingen: false,
            vilkarStatus: vilkårStatus.IKKE_VURDERT,
          },
        ],
      },
    ];

    const result = hentAktivePerioderFraVilkar(vilkar, true);
    expect(result).toEqual([
      {
        periode: { fom: '2023-02-01', tom: '' },
        vurderesIBehandlingen: false,
        vilkarStatus: vilkårStatus.IKKE_VURDERT,
      },
      {
        periode: { fom: '2023-01-01', tom: '' },
        vurderesIBehandlingen: false,
        vilkarStatus: vilkårStatus.IKKE_VURDERT,
      },
    ]);
  });
});
