import type { VilkarResultPickerFormState } from './VilkarResultPickerPeriodisertRHF';

export type VilkarBegrunnelseFormState = {
  begrunnelse: string;
};

export type VilkarresultatMedBegrunnelseState = VilkarBegrunnelseFormState & VilkarResultPickerFormState;

export type VilkarresultatMedOverstyringFormState = VilkarresultatMedBegrunnelseState & {
  isOverstyrt: boolean;
};
