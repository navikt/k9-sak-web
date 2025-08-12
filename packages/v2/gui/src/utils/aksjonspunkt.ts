import {
  kodeverk_behandling_BehandlingStatus as behandlingStatus,
  type sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  type kodeverk_behandling_BehandlingStatus as BehandlingStatus,
} from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

export const kanAksjonspunktRedigeres = (
  { status: apStatus, erAktivt }: Pick<AksjonspunktDto, 'status' | 'erAktivt'>,
  behStatus: BehandlingStatus,
): boolean => {
  return apStatus === aksjonspunktStatus.UTFØRT && erAktivt === true && behStatus === behandlingStatus.UTREDES;
};

export const skalAksjonspunktUtredes = (
  { status: apStatus, erAktivt }: Pick<AksjonspunktDto, 'status' | 'erAktivt'>,
  behStatus: BehandlingStatus,
): boolean => {
  return apStatus === aksjonspunktStatus.OPPRETTET && erAktivt === true && behStatus === behandlingStatus.UTREDES;
};

export const erAksjonspunktReadOnly = ({ kanLoses, status }: Pick<AksjonspunktDto, 'kanLoses' | 'status'>): boolean => {
  return kanLoses === false && status === aksjonspunktStatus.UTFØRT;
};
