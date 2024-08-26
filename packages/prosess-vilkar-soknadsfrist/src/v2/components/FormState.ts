interface AvklarteKrav {
  erVilkarOk: string | boolean;
  begrunnelse: string;
  journalpostId: string;
  fraDato: string;
}

export interface FormState {
  isOverstyrt: boolean;
  avklarteKrav: AvklarteKrav[];
}
