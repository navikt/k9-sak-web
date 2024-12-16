export type MerknadDto = {
  fritekst?: string | null;
  merknadKoder?: Array<'HASTESAK' | 'VANSKELIG_SAK' | null> | null;
};
