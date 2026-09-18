import type { MedlemskapPeriodeInfoDto } from './MedlemskapPeriodeInfoDto.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type, se MedlemskapDto.ts for begrunnelse.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/ForutgåendeMedlemskapResponse.java
 */
export type ForutgåendeMedlemskapResponse = {
  perioder: MedlemskapPeriodeInfoDto[];
};
