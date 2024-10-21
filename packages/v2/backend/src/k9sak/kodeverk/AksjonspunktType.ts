import type { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';

export type AksjonspunktType = NonNullable<AksjonspunktDto['aksjonspunktType']>;
type AksjonspunktTypeName = 'MANUELL' | 'AUTOPUNKT' | 'OVERSTYRING' | 'SAKSBEHANDLEROVERSTYRING';
export const aksjonspunktType: Readonly<Record<AksjonspunktTypeName, AksjonspunktType>> = {
  MANUELL: 'MANU',
  AUTOPUNKT: 'AUTO',
  OVERSTYRING: 'OVST',
  SAKSBEHANDLEROVERSTYRING: 'SAOV',
};
