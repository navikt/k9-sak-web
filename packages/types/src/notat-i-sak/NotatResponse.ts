import NotatGjelderType from './NotatGjelderType';

interface NotatResponse {
  endretAv: string;
  endretTidspunkt: null;
  gjelderType: { kode: NotatGjelderType; navn: string };
  notatId: number;
  notatTekst: string;
  opprettetAv: string;
  opprettetTidspunkt: string;
  sakstype?: string; // Er dette fagsaktype eller behandlingstype?
  skjult: boolean;
  versjon: number;
  kanRedigere: boolean;
}

export default NotatResponse;
