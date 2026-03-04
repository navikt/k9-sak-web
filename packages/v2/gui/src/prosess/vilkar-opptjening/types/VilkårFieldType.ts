import type { VilkårStatus as VilkårPeriodeDtoVilkarStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';

export type VilkårFieldType = {
  periode: {
    fom: string;
    tom: string;
  };
  begrunnelse: string;
  vurderesIBehandlingen: boolean;
  vurderesIAksjonspunkt: boolean;
  kode: '7847A' | '7847B' | VilkårPeriodeDtoVilkarStatus;
};
