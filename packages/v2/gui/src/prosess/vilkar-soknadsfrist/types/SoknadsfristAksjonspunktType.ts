import type { AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { AksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';

export type SoknadsfristAksjonspunktType = {
  aksjonspunktType: AksjonspunktType;
  begrunnelse?: string;
  definisjon: string;
  status: AksjonspunktStatus;
  kanLoses: boolean;
};
