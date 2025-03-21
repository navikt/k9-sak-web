import {
  KontrollerInntektPeriodeDtoStatus,
  type KontrollerInntektDto,
  type UngdomsytelseSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';

export class FakeUngBeregningBackendApi {
  async getSatser(): Promise<UngdomsytelseSatsPeriodeDto[]> {
    return [
      {
        antallBarn: 0,
        dagsatsBarnetillegg: 0,
        fom: '2024-01-01',
        tom: '2024-02-01',
        dagsats: 608.31,
        grunnbeløpFaktor: 1.3333,
        grunnbeløp: 118620,
        satsType: 'LAV',
      },
    ];
  }

  async getKontrollerInntekt(): Promise<KontrollerInntektDto> {
    return {
      kontrollperioder: [
        {
          erTilVurdering: false,
          fastsattArbeidsinntekt: 123,
          fastsattYtelse: 456,
          periode: { fom: '2025-01-01', tom: '2025-01-31' },
          rapporterteInntekter: {
            bruker: {
              arbeidsinntekt: 123,
              ytelse: 456,
            },
            register: {
              arbeidsinntekt: 123,
              ytelse: 456,
            },
          },
          status: KontrollerInntektPeriodeDtoStatus.INGEN_AVVIK,
        },
        {
          erTilVurdering: true,
          fastsattArbeidsinntekt: 5000,
          fastsattYtelse: 2500,
          periode: { fom: '2025-02-01', tom: '2025-02-28' },
          rapporterteInntekter: {
            bruker: {
              arbeidsinntekt: 4800,
              ytelse: 2600,
            },
            register: {
              arbeidsinntekt: 5200,
              ytelse: 2400,
            },
          },
          status: KontrollerInntektPeriodeDtoStatus.AVVIK,
        },
      ],
    };
  }
}
