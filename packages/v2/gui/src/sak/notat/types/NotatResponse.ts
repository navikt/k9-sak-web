import type { OpprettNotatDtoNotatGjelderType } from '@k9-sak-web/backend/k9sak/generated';

export interface NotatResponse {
  endretAv: string;
  endretTidspunkt: null | Date;
  gjelderType?: { kode: OpprettNotatDtoNotatGjelderType; navn: string };
  notatId: number;
  notatTekst: string;
  opprettetAv: string;
  opprettetTidspunkt: string;
  sakstype?: string;
  skjult: boolean;
  versjon: number;
  kanRedigere: boolean;
}
