export interface FeilutbetalingFaktaViewModel {
  behandlingFakta?: FeilutbetalingFaktaDetaljerViewModel;
}

export interface FeilutbetalingFaktaDetaljerViewModel {
  aktuellFeilUtbetaltBeløp?: number;
  begrunnelse?: string;
  datoForRevurderingsvedtak?: string;
  perioder?: FeilutbetalingPeriodeViewModel[];
  tidligereVarseltBeløp?: number;
  tilbakekrevingValg?: {
    videreBehandling?: string;
  };
  totalPeriodeFom?: string;
  totalPeriodeTom?: string;
}

export interface FeilutbetalingPeriodeViewModel {
  belop?: number;
  feilutbetalingÅrsakDto?: {
    hendelseType?: string;
    hendelseUndertype?: string;
  };
  fom?: string;
  tom?: string;
}

export interface FeilutbetalingHendelseTypeViewModel {
  hendelseType?: string;
  hendelseUndertyper?: string[];
}

export interface FeilutbetalingÅrsakerPerYtelseViewModel {
  hendelseTyper?: FeilutbetalingHendelseTypeViewModel[];
  ytelseType?: string;
}
