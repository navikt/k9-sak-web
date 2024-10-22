import type { SatserData } from '../../prosess/ung-beregning/SatserData';

export class FakeUngBeregningBackendApi {
  async getSatser(): Promise<SatserData[]> {
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
