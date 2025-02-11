import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

export const isAksjonspunktOpen = (statusKode: string): boolean => statusKode === aksjonspunktStatus.OPPRETTET;
