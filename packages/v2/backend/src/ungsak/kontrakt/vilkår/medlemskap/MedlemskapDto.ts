import type { ung_sak_typer_Periode } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { UtenlandsoppholdDto } from './UtenlandsoppholdDto.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type. ung-sak#1603-oppfølgingen (nytt `perioder`-felt
 * på ForutgåendeMedlemskapResponse) er ikke sluppet ennå, så @navikt/ung-sak-typescript-client
 * mangler denne formen. Erstatt med generert re-eksport når kontrakten er publisert.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/MedlemskapDto.java
 */
export type MedlemskapDto = {
  forutgåendePeriode: ung_sak_typer_Periode;
  harBoddINorge: boolean;
  harJobbetINorge: boolean | null;
  harJobbetUtenforNorge: boolean | null;
  journalpostId: string;
  utenlandsopphold: UtenlandsoppholdDto[];
};
