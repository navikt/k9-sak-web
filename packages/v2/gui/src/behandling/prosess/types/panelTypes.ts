import type { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * Panelregistreringsdata.
 * Hvert panel registrerer seg med denne informasjonen.
 */
export interface PanelRegistrering {
  /** Unik panelidentifikator */
  id: string;

  /** URL-parameterverdi (kebab-case, f.eks. "beregning", "varsel-om-revurdering") */
  urlKode: string;

  /** 
   * i18n tekstnøkkel for menylabel (f.eks. "Beregning.Title")
   * TODO: Usikker på om vi skal ha denne
   */
  tekstKode: string;

  /** Menystatusindikator type (warning | success | danger | default) */
  type?: ProcessMenuStepType;

  /** Vis delvis fullføringsindikator for paneler som er delvis fullført */
  usePartialStatus?: boolean;

  /** Om dette panelet er aktivt/valgt */
  erAktiv?: boolean;
}

/**
 * Re-eksporterer ProcessMenuStepType for bekvemmelighet.
 * Brukes til å indikere status på et panel i menyen.
 * 
 * - warning: Panel har åpent aksjonspunkt som krever oppmerksomhet
 * - success: Panel er fullført (vilkår oppfylt)
 * - danger: Panel har problemer (vilkår ikke oppfylt)
 * - default: Panel ikke evaluert ennå eller nøytral tilstand
 */
export type { ProcessMenuStepType };
