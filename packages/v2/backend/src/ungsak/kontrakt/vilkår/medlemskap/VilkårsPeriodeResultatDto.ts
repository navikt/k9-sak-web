import type { ung_sak_typer_Periode } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { MedlemskapAvslagsÅrsakType } from './MedlemskapAvslagsÅrsakType.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type, se UtenlandsoppholdDto.ts for begrunnelse.
 * Uendret innhold fra forrige kontraktversjon.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/VilkårsPeriodeResultatDto.java
 */
export type VilkårsPeriodeResultatDto = {
  periode: ung_sak_typer_Periode;
  utfall: Utfall;
  avslagsårsak: MedlemskapAvslagsÅrsakType | null;
  begrunnelse: string | null;
};
