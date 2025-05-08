import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { hentAktivePerioderFraVilkar } from './hentAktivePerioderFraVilkar';

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
