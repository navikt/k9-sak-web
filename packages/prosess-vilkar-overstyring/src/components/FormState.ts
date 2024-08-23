import { VilkarResultPickerFormState } from '@k9-sak-web/prosess-felles/src/vilkar/VilkarResultPickerRHF';

export type VilkarBegrunnelseFormState = {
  begrunnelse: string;
};

export type VilkarresultatMedBegrunnelseState = VilkarBegrunnelseFormState & VilkarResultPickerFormState;

export type VilkarresultatMedOverstyringFormState = VilkarresultatMedBegrunnelseState & {
  isOverstyrt: boolean;
};