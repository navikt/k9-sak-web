import { NotatGjelderType } from './NotatGjelderType';

export interface NotatResponse {
  endretAv: string;
  endretTidspunkt: null;
  gjelderType: { kode: NotatGjelderType; navn: string };
  notatId: number;
  notatTekst: string;
  opprettetAv: string;
  opprettetTidspunkt: string;
  sakstype?: string;
  skjult: boolean;
  versjon: number;
}
