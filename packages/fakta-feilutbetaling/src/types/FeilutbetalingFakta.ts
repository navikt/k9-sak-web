export type FeilutbetalingFakta = {
  behandlingFakta: {
    perioder: {
      fom: string;
      tom: string;
      belop: number;
      feilutbetalingÅrsakDto?: {
        hendelseType: string;
        hendelseUndertype: string;
      };
    }[];
    totalPeriodeFom: string;
    totalPeriodeTom: string;
    aktuellFeilUtbetaltBeløp: number;
    tidligereVarseltBeløp?: number;
    behandlingÅrsaker: { behandlingArsakType: string }[];
    behandlingsresultat: {
      type: string;
      konsekvenserForYtelsen: string[];
    };
    tilbakekrevingValg: { videreBehandling: string }; // #Kodeverk: kan det være denne skal være et oppslag og ikke en string?
    datoForRevurderingsvedtak: string;
    begrunnelse?: string;
  };
};
