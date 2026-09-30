export type BackendNavn = 'k9sak' | 'k9klage' | 'k9tilbake' | 'ungsak' | 'ungtilbake';

// Brukes av klienter som sammenstiller data fra flere backends innenfor samme område,
// f.eks. historikk som henter fra k9sak, k9klage og k9tilbake. 'k9' dekker k9-backends, 'ung' dekker ung-backends.
export type SammenstiltBackendNavn = 'k9' | 'ung';

// Sier hvilken backend en klient tilhører. Alle BackendApiType-er skal utvide dette. Feltet brukes i queryKey for å skille backends i cachen.
// Standard er én enkelt backend. Klienter som sammenstiller flere backends må eksplisitt bruke BackendTilhørighet<SammenstiltBackendNavn>.
export interface BackendTilhørighet<B extends BackendNavn | SammenstiltBackendNavn = BackendNavn> {
  readonly backend: B;
}
