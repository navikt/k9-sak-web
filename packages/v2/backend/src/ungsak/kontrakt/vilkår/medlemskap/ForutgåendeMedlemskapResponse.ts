import type { MedlemskapDto } from './MedlemskapDto.js';
import type { VilkårsPeriodeResultatDto } from './VilkårsPeriodeResultatDto.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type, se UtenlandsoppholdDto.ts for begrunnelse.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/ForutgåendeMedlemskapResponse.java
 */
export type ForutgåendeMedlemskapResponse = {
  medlemskapFraBruker: MedlemskapDto | null;
  vilkårsperioder: VilkårsPeriodeResultatDto[];
};
