import type { UtenlandsoppholdDto } from './UtenlandsoppholdDto.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type, se UtenlandsoppholdDto.ts for begrunnelse.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/MedlemskapDto.java
 */
export type MedlemskapDto = {
  harBoddINorge: boolean;
  harJobbetINorge: boolean | null;
  harJobbetUtenforNorge: boolean | null;
  journalpostId: string;
  utenlandsopphold: UtenlandsoppholdDto[];
};
