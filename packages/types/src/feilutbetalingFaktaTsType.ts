import Kodeverk from './kodeverkTsType';

export type FeilutbetalingFakta = {
  behandlingFakta?: {
    perioder?: {
      fom: string;
      tom: string;
      belop: number;
      feilutbetalingÅrsakDto?: {
        hendelseType: {
          kode: string;
          navn: string;
        };
        hendelseUndertype?: {
          kode: string;
          navn: string;
        };
      };
    }[];
    totalPeriodeFom: string;
    totalPeriodeTom: string;
    aktuellFeilUtbetaltBeløp: number;
    tidligereVarseltBeløp?: number;
    behandlingÅrsaker?: {
      behandlingArsakType: Kodeverk;
    }[];
    behandlingsresultat?: {
      type: Kodeverk;
      konsekvenserForYtelsen: Kodeverk[];
    };
    tilbakekrevingValg?: {
      videreBehandling: Kodeverk;
    };
    datoForRevurderingsvedtak: string;
    begrunnelse?: string;
  };
};

export default FeilutbetalingFakta;
