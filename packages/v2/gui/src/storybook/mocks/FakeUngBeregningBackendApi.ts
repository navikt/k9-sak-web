import type { UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';

export class FakeUngBeregningBackendApi {
  async getSatser(): Promise<UngdomsytelseSatsPeriodeDto[]> {
    return [
      {
        fom: '2024-01-01',
        tom: '2024-02-01',
        dagsats: 608.31,
        grunnbeløpFaktor: 1.3333,
        grunnbeløp: 118620,
        satsType: 'LAV',
      },
    ];
  }
}