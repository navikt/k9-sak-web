import type { ung_sak_typer_Periode } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { MedlemskapAvslagsÅrsakType } from './MedlemskapAvslagsÅrsakType.js';
import type { MedlemskapDto } from './MedlemskapDto.js';

/**
 * TODO(TSFF-3050): Midlertidig, håndskrevet type, se MedlemskapDto.ts for begrunnelse.
 * Kilde: kontrakt/src/main/java/no/nav/ung/sak/kontrakt/vilkår/medlemskap/MedlemskapPeriodeInfoDto.java
 */
export type MedlemskapPeriodeInfoDto = {
  periode: ung_sak_typer_Periode;
  utfall: Utfall;
  avslagsårsak: MedlemskapAvslagsÅrsakType | null;
  begrunnelse: string | null;
  vurderesIBehandlingen: boolean;
  erManueltVurdert: boolean;
  medlemskapFraBruker: MedlemskapDto | null;
};
