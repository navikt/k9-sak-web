import type { MedlemskapDto } from './MedlemskapDto.js';
import type { MedlemskapPeriodeResultatDto } from './MedlemskapPeriodeResultatDto.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type, se MedlemskapDto.ts for begrunnelse.
 * `medlemskapFraBruker` er avviklet og skal fjernes fra kontrakten senere — bruk `resultater`,
 * som gir medlemskapsgrunnlag skalert per vilkårsperiode.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/ForutgåendeMedlemskapResponse.java
 */
export type ForutgåendeMedlemskapResponse = {
  /** @deprecated Skal fjernes fra kontrakten — bruk `resultater` i stedet. */
  medlemskapFraBruker: MedlemskapDto | null;
  resultater: MedlemskapPeriodeResultatDto[];
};
