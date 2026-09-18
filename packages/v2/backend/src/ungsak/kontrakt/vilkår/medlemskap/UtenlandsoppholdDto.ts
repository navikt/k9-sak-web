import type { ung_sak_typer_Periode } from '@k9-sak-web/backend/ungsak/generated/types.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type. Nytt felt `harTrygdeavtale` er lagt til i
 * ung-sak, men @navikt/ung-sak-typescript-client er ikke publisert på nytt ennå.
 * Erstatt med generert re-eksport når kontrakten er publisert.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/UtenlandsoppholdDto.java
 */
export type UtenlandsoppholdDto = {
  periode: ung_sak_typer_Periode;
  land: string;
  landkode: string;
  harJobbetIPerioden: boolean | null;
  utenlandskNasjonalId: string | null;
  harTrygdeavtale: boolean;
};
