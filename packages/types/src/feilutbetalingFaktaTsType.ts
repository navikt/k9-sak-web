export type FeilutbetalingFakta = {
  behandlingFakta?: {
    perioder?: {
      fom: string;
      tom: string;
      belop: number;
      feilutbetalingÅrsakDto?: {
        hendelseType: string;
        hendelseUndertype?: string;
      };
    }[];
    totalPeriodeFom: string;
    totalPeriodeTom: string;
    aktuellFeilUtbetaltBeløp: number;
    tidligereVarseltBeløp?: number;
    behandlingÅrsaker?: {
      behandlingArsakType: string;
    }[];
    behandlingsresultat?: {
      type: string;
      konsekvenserForYtelsen: string[];
    };
    tilbakekrevingValg?: {
      videreBehandling: string;
    };
    datoForRevurderingsvedtak: string;
    begrunnelse?: string;
  };
};

export default FeilutbetalingFakta;
