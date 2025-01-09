import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

export const kanAksjonspunktRedigeres = (aksjonspunkt: AksjonspunktDto): boolean => {
  const { status, erAktivt } = aksjonspunkt;
  return status === aksjonspunktStatus.UTFØRT && erAktivt === true;
};

export const erAksjonspunktReadOnly = (aksjonspunkt: AksjonspunktDto): boolean => {
  return aksjonspunkt.kanLoses === false && aksjonspunkt.status === aksjonspunktStatus.UTFØRT;
};
