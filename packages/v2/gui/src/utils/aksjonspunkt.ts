import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

export const kanAksjonspunktRedigeres = (aksjonspunkt: AksjonspunktDto): boolean => {
  return aksjonspunkt.status === aksjonspunktStatus.UTFORT && aksjonspunkt.erAktivt === true;
};

export const erAksjonspunktReadOnly = (aksjonspunkt: AksjonspunktDto): boolean => {
  return aksjonspunkt.kanLoses === false && aksjonspunkt.status === aksjonspunktStatus.UTFORT;
};
