import { NotatGjelderType } from './NotatGjelderType';

export interface NotatResponse {
  id: number;
  notatTekst: string;
  gjelderType: NotatGjelderType;
  versjon: number;
  opprettetAv: string;
  opprettetTidspunkt: string;
  endretAv: string;
  endretTidspunkt: null;
  fagsakId?: string;
  aktørId?: string;
  sakstype?: string;
}
