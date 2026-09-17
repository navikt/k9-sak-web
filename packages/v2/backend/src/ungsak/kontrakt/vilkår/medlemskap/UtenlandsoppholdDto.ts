import type { ung_sak_typer_Periode } from '@k9-sak-web/backend/ungsak/generated/types.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type. ung-sak#1603 er ikke sluppet ennå, så
 * @navikt/ung-sak-typescript-client mangler denne typen. Erstatt med generert re-eksport
 * (se backend-client-generator-mønsteret) når kontrakten er publisert.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/UtenlandsoppholdDto.java
 */
export type UtenlandsoppholdDto = {
  periode: ung_sak_typer_Periode;
  land: string;
  landkode: string;
  harJobbetIPerioden: boolean | null;
  utenlandskNasjonalId: string | null;
};
