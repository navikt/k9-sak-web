export enum InstitusjonFormFields {
  BEGRUNNELSE = 'begrunnelse',
  GODKJENT_INSTITUSJON = 'godkjentInstitusjon',
}
export interface InstitusjonFormValues {
  [InstitusjonFormFields.BEGRUNNELSE]: string;
  [InstitusjonFormFields.GODKJENT_INSTITUSJON]: boolean;
}

export interface InstitusjonPeriod {
  fom: string;
  tom: string;
}

export interface InstitusjonDisplayData {
  institusjon: string;
  periode: InstitusjonPeriod;
}
