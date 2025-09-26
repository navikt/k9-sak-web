import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '../../k9sak/generated/types.js';

export type AksjonspunktType = NonNullable<AksjonspunktDto['aksjonspunktType']>;
type AksjonspunktTypeName = 'MANUELL' | 'AUTOPUNKT' | 'OVERSTYRING' | 'SAKSBEHANDLEROVERSTYRING';
export const aksjonspunktType: Readonly<Record<AksjonspunktTypeName, AksjonspunktType>> = {
  MANUELL: 'MANU',
  AUTOPUNKT: 'AUTO',
  OVERSTYRING: 'OVST',
  SAKSBEHANDLEROVERSTYRING: 'SAOV',
};
