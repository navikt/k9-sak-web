import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

export const kanAksjonspunktRedigeres = (aksjonspunkt: AksjonspunktDto): boolean => {
  const { status, erAktivt, kanLoses } = aksjonspunkt;
  return status === aksjonspunktStatus.UTFORT && erAktivt && kanLoses === true;
};

export const erAksjonspunktReadOnly = (aksjonspunkt: AksjonspunktDto): boolean => {
  return aksjonspunkt.kanLoses === false && aksjonspunkt.status === aksjonspunktStatus.UTFORT;
};
