interface AvklarteKrav {
  erVilkarOk: string | boolean | null;
  begrunnelse?: string;
  journalpostId: string;
  fraDato: string;
}

export interface FormState {
  isOverstyrt: boolean;
  avklarteKrav: AvklarteKrav[];
}
