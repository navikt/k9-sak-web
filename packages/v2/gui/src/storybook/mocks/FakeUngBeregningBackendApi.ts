import {
  type GetUngdomsprogramInformasjonResponse,
  type KontrollerInntektDto,
  type UngdomsytelseSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';

export class FakeUngBeregningBackendApi {
  async getSatser(): Promise<UngdomsytelseSatsPeriodeDto[]> {
    return [
      {
        antallBarn: 1,
        dagsats: 954.06,
        dagsatsBarnetillegg: 37,
        fom: '2025-01-01',
        grunnbeløp: 124028.0,
        grunnbeløpFaktor: 2.0,
        satsType: 'HØY',
        tom: '2025-12-30',
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
    return { maksdatoForDeltakelse: '2025-12-30', opphørsdato: '2025-02-15', antallDagerBruktForTilkjentePerioder: 33 };
  }
}
