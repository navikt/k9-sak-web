import {
  BehandlingDtoStatus as behandlingStatus,
  type AksjonspunktDto,
  type BehandlingDtoStatus,
} from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

export const kanAksjonspunktRedigeres = (
  { status: apStatus, erAktivt }: Pick<AksjonspunktDto, 'status' | 'erAktivt'>,
  behStatus: BehandlingDtoStatus | undefined,
): boolean => {
  return apStatus === aksjonspunktStatus.UTFØRT && erAktivt === true && behStatus === behandlingStatus.UTREDES;
};

export const skalAksjonspunktUtredes = (
  { status: apStatus, erAktivt }: Pick<AksjonspunktDto, 'status' | 'erAktivt'>,
  behStatus: BehandlingDtoStatus | undefined,
): boolean => {
  return apStatus === aksjonspunktStatus.OPPRETTET && erAktivt === true && behStatus === behandlingStatus.UTREDES;
};

export const erAksjonspunktReadOnly = ({ kanLoses, status }: Pick<AksjonspunktDto, 'kanLoses' | 'status'>): boolean => {
  return kanLoses === false && status === aksjonspunktStatus.UTFØRT;
};
