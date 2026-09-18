export interface OpphørVarselPeriodForm {
  begrunnelseForIkkeVarsle: string;
  forhåndsvarselTekst: string;
  skalSendeVarselOmOpphør: string;
}

export interface OpphørVarselFormData {
  perioder: Record<string, OpphørVarselPeriodForm>;
}
