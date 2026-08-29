/**
 * Midlertidig lokal definisjon. `kilde` finnes ennå ikke i publisert ts-client.
 *
 * TODO(TSFF-2990): erstatt med re-eksport fra generert klient når ny versjon av
 * `@navikt/ung-sak-typescript-client` er publisert:
 * `export { ung_kodeverk_vilkår_BostedsavklaringKildeType as BostedsavklaringKildeType } from '@k9-sak-web/backend/ungsak/generated/types.js';`
 */
export const BostedsavklaringKildeType = {
  BRUKER: 'BRUKER',
  FOLKEREGISTER: 'FOLKEREGISTER',
  ANNET: 'ANNET',
} as const;

export type BostedsavklaringKildeType = (typeof BostedsavklaringKildeType)[keyof typeof BostedsavklaringKildeType];
