import type { RelatertYtelseResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import { describe, expect, it } from 'vitest';
import { grupperYtelserPåSak, lagYtelsePerioder, sorterYtelsePerioder, sorterYtelseSaker } from './ytelseSakUtils.js';

const ytelser: RelatertYtelseResponse[] = [
  {
    ytelseType: 'PSB',
    data: [
      { fom: '2026-01-01', tom: '2026-01-31', status: 'AVSLUTTET', relatertSaksnummer: 'PSB001' },
      { fom: '2026-03-01', tom: '2026-03-31', status: 'IKKESTARTET', relatertSaksnummer: 'PSB002' },
      { fom: '2026-05-01', tom: '2026-05-31', status: 'ÅPEN', relatertSaksnummer: 'PSB002' },
    ],
  },
];

describe('ytelseSakUtils', () => {
  it('grupperer perioder per sak og sorterer gjeldende sak først', () => {
    const perioder = lagYtelsePerioder(ytelser);
    const saker = sorterYtelseSaker(grupperYtelserPåSak(perioder, 'PSB002'), ytelseType => ytelseType);

    expect(saker).toHaveLength(2);
    expect(saker[0]).toMatchObject({ saksnummer: 'PSB002', erGjeldendeSak: true });
    expect(saker[0]?.perioder).toHaveLength(2);
    expect(saker[1]).toMatchObject({ saksnummer: 'PSB001', erGjeldendeSak: false });
  });

  it('beholder én tabellrad per periode og viser gjeldende sak først', () => {
    const perioder = sorterYtelsePerioder(lagYtelsePerioder(ytelser), 'PSB002');

    expect(perioder.map(periode => periode.relatertSaksnummer)).toEqual(['PSB002', 'PSB002', 'PSB001']);
  });
});
