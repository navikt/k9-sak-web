import type { ÅrsakIkkeTilgang } from '@k9-sak-web/backend/shared/errorhandling/ÅrsakIkkeTilgang.js';

// Visningstekst for kvar årsak til at brukar ikkje har tilgang.
export const årsakIkkeTilgangTekst: Record<ÅrsakIkkeTilgang, string> = {
  HAR_IKKE_TILGANG_TIL_KODE6_PERSON: 'Du mangler tilgang til saker med strengt fortrolig adresse (kode 6)',
  HAR_IKKE_TILGANG_TIL_KODE7_PERSON: 'Du mangler tilgang til saker med fortrolig adresse (kode 7)',
  HAR_IKKE_TILGANG_TIL_EGEN_ANSATT: 'Du mangler tilgang til saker som gjelder Nav-ansatte',
  HAR_IKKE_TILGANG_TIL_HISTORISK_SAK: 'Du mangler tilgang til historiske saker',
  HAR_IKKE_TILGANG_TIL_APPLIKASJONEN: 'Du er ikke tildelt en rolle som gir tilgang til k9-sak',
  HAR_IKKE_TILGANG_TIL_TJENESTE_FOR_BORGER: 'Tjenesten er ikke tilgjengelig for borgere',
  HAR_IKKE_TILGANG_TIL_TJENESTE_FOR_DRIFT: 'Du mangler driftsrettigheter',
  HAR_IKKE_TILGANG_TIL_PIP_TJENESTE: 'Feil ved tilgangskontrolltjenesten',
  HAR_IKKE_TILGANG_ANNEN_GRUNN: 'Tilgang avslått av annen grunn',
  TEKNISK_FEIL: 'Teknisk feil ved tilgangskontroll',
};

// Årsakene vi ønsker å vise til brukar. Andre årsaker filtrerast bort.
export const årsakerViØnskerÅVise: ÅrsakIkkeTilgang[] = [
  'HAR_IKKE_TILGANG_TIL_KODE6_PERSON',
  'HAR_IKKE_TILGANG_TIL_KODE7_PERSON',
  'HAR_IKKE_TILGANG_TIL_EGEN_ANSATT',
  'HAR_IKKE_TILGANG_TIL_HISTORISK_SAK',
  'HAR_IKKE_TILGANG_TIL_APPLIKASJONEN',
  'TEKNISK_FEIL',
];

// Filtrer årsaker til dei vi ønsker å vise, og fjern duplikater.
export const resolveÅrsakerIkkeTilgang = (ikkeTilgangÅrsaker?: ReadonlyArray<ÅrsakIkkeTilgang>): ÅrsakIkkeTilgang[] => {
  const filtrerteÅrsaker = ikkeTilgangÅrsaker
    ? ikkeTilgangÅrsaker.filter(årsak => årsakerViØnskerÅVise.includes(årsak))
    : [];

  return Array.from(new Set(filtrerteÅrsaker));
};

// Utled visningstekstane for årsakene vi ønsker å vise til brukar.
export const resolveÅrsakIkkeTilgangTekster = (ikkeTilgangÅrsaker?: ReadonlyArray<ÅrsakIkkeTilgang>): string[] =>
  resolveÅrsakerIkkeTilgang(ikkeTilgangÅrsaker).map(årsak => årsakIkkeTilgangTekst[årsak] ?? årsak);
