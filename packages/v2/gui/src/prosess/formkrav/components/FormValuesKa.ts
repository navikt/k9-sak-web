export interface FormValuesKa {
  vedtak: string | null;
  begrunnelse: string | null | undefined;
  erKlagerPart: boolean | undefined;
  erKonkret: boolean | undefined;
  erFristOverholdt: boolean | undefined;
  erSignert: boolean | undefined;
  valgtPartMedKlagerett: string | null;
}
