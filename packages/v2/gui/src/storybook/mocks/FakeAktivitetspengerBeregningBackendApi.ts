import type {
  ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  ung_sak_kontrakt_kontroll_KontrollerInntektDto as KontrollerInntektDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { AktivitetspengerBeregningBackendApiType } from '../../prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendApiType';

export class FakeAktivitetspengerBeregningBackendApi implements AktivitetspengerBeregningBackendApiType {
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

  async getArbeidsgiverOpplysninger(): Promise<ArbeidsgiverOversiktDto> {
    return {
      arbeidsgivere: {},
    };
  }
}
