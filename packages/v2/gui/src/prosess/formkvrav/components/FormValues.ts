export interface FormValues {
  vedtak: string | null;
  begrunnelse: string | null | undefined;
  erKlagerPart: boolean | null | undefined;
  erKonkret: boolean | null | undefined;
  erFristOverholdt: boolean | null | undefined;
  erSignert: boolean | null | undefined;
  valgtPartMedKlagerett: string | null;
}
