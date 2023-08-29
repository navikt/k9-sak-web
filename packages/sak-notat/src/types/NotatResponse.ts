import { NotatGjelderType } from './NotatGjelderType';

export interface NotatResponse {
  aktørId?: string;
  endretAv: string;
  endretTidspunkt: null;
  fagsakId?: string;
  gjelderType: NotatGjelderType;
  id: number;
  notatTekst: string;
  opprettetAv: string;
  opprettetTidspunkt: string;
  sakstype?: string;
  skjult: boolean;
  versjon: number;
}
