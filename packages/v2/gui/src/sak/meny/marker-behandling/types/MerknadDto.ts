export type MerknadDto = {
  fritekst?: string;
  merknadKoder?: Array<'HASTESAK' | 'VANSKELIG_SAK' | null> | null;
};
