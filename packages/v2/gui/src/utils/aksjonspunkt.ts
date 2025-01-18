import { behandlingStatus, type AksjonspunktDto, type BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

export const kanAksjonspunktRedigeres = (
  { status: apStatus, erAktivt }: Pick<AksjonspunktDto, 'status' | 'erAktivt'>,
  { status: behStatus }: Pick<BehandlingDto, 'status'>,
): boolean => {
  return apStatus === aksjonspunktStatus.UTFORT && erAktivt === true && behStatus === behandlingStatus.UTRED;
};

export const erAksjonspunktReadOnly = ({ kanLoses, status }: Pick<AksjonspunktDto, 'kanLoses' | 'status'>): boolean => {
  return kanLoses === false && status === aksjonspunktStatus.UTFORT;
};
