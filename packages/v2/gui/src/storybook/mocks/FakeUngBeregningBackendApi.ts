import {
  type GetUngdomsprogramInformasjonResponse,
  type KontrollerInntektDto,
  type UngdomsytelseSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';

export class FakeUngBeregningBackendApi {
  async getSatsOgUtbetalingPerioder(): Promise<UngdomsytelseSatsPeriodeDto[]> {
    return [
      {
        måned: '2025-01',
        satsperioder: [
          {
            fom: '2025-01-01',
            tom: '2025-01-14',
            dagsats: 649.08,
            grunnbeløpFaktor: 1.3607,
            grunnbeløp: 124028.0,
            satsType: 'LAV',
            antallBarn: 0,
            dagsatsBarnetillegg: 0,
            antallDager: 10,
          },
          {
            fom: '2025-01-15',
            tom: '2025-01-31',
            dagsats: 973.62,
            grunnbeløpFaktor: 2.041,
            grunnbeløp: 124028.0,
            satsType: 'HØY',
            antallBarn: 0,
            dagsatsBarnetillegg: 0,
            antallDager: 13,
          },
        ],
        antallDager: 23,
        reduksjon: 0.0,
        utbetaling: 19147.86,
        status: 'UTBETALT',
      },
      {
        måned: '2025-02',
        satsperioder: [
          {
            fom: '2025-02-01',
            tom: '2025-02-28',
            dagsats: 973.62,
            grunnbeløpFaktor: 2.041,
            grunnbeløp: 124028.0,
            satsType: 'HØY',
            antallBarn: 0,
            dagsatsBarnetillegg: 0,
            antallDager: 20,
          },
        ],
        antallDager: 20,
        rapportertInntekt: 0,
        reduksjon: 0.0,
        utbetaling: 19472.4,
        status: 'TIL_UTBETALING',
      },
      {
        måned: '2025-03',
        satsperioder: [
          {
            fom: '2025-03-01',
            tom: '2025-03-31',
            dagsats: 973.62,
            grunnbeløpFaktor: 2.041,
            grunnbeløp: 124028.0,
            satsType: 'HØY',
            antallBarn: 0,
            dagsatsBarnetillegg: 0,
            antallDager: 21,
          },
        ],
        antallDager: 21,
        rapportertInntekt: 0,
        reduksjon: 0.0,
        utbetaling: 20446.02,
        status: 'TIL_UTBETALING',
      },
      {
        måned: '2025-04',
        satsperioder: [
          {
            fom: '2025-04-01',
            tom: '2025-04-30',
            dagsats: 973.62,
            grunnbeløpFaktor: 2.041,
            grunnbeløp: 124028.0,
            satsType: 'HØY',
            antallBarn: 0,
            dagsatsBarnetillegg: 0,
            antallDager: 22,
          },
        ],
        antallDager: 22,
        rapportertInntekt: 0,
        reduksjon: 0.0,
        utbetaling: 21419.64,
        status: 'TIL_UTBETALING',
      },
    ];
  }

  async getKontrollerInntekt(): Promise<KontrollerInntektDto> {
    return {
      kontrollperioder: [
        {
          erTilVurdering: true,
          periode: { fom: '2025-02-01', tom: '2025-02-28' },
          rapporterteInntekter: { bruker: {}, register: { oppsummertRegister: { arbeidsinntekt: 1500 } } },
          status: 'AVVIK',
          uttalelseFraBruker:
            'Jeg fikk forskuttert litt lønn av arbeidsgiver denne måneden fordi jeg har hatt økonomiske utfordringer, så jeg rapporterte bare det jeg egentlig skulle fått utbetalt. Det var ikke meningen å oppgi feil, bare å holde det riktig for denne måneden!',
        },
      ],
    };
  }

  async getUngdomsprogramInformasjon(): Promise<GetUngdomsprogramInformasjonResponse> {
    return {
      maksdatoForDeltakelse: '2025-12-30',
      opphørsdato: '2025-02-15',
      startdato: '2025-01-01',
      antallDagerTidligereUtbetalt: 33,
    };
  }
}
