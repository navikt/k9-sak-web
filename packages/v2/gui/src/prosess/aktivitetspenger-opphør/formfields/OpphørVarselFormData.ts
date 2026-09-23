export interface OpphørVarselPeriodForm {
  begrunnelseForIkkeVarsle: string;
  fritekstTilVarsel: string;
  skalSendeVarselOmOpphør: string;
}

export interface OpphørVarselFormData {
  perioder: Record<string, OpphørVarselPeriodForm>;
}
