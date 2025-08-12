import type { kodeverk_vilkår_Utfall as VilkårPeriodeDtoVilkarStatus } from '@k9-sak-web/backend/k9sak/generated';

export type VilkårFieldType = {
  begrunnelse: string;
  vurderesIBehandlingen: boolean;
  vurderesIAksjonspunkt: boolean;
  kode: '7847A' | '7847B' | VilkårPeriodeDtoVilkarStatus;
};
