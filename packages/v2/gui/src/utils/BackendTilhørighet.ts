export type BackendNavn = 'k9sak' | 'k9klage' | 'k9tilbake' | 'ungsak' | 'ungtilbake';

// Sier hvilken backend en klient tilhører. Alle BackendApiType-er skal utvide dette. Feltet brukes i queryKey for å skille backends i cachen.
export interface BackendTilhørighet<B extends BackendNavn = BackendNavn> {
  readonly backend: B;
}
