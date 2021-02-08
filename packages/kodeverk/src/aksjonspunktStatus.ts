const aksjonspunktStatus = {
  OPPRETTET: 'OPPR',
  UTFORT: 'UTFO',
  AVBRUTT: 'AVBR',
};

export default aksjonspunktStatus;

export const isAksjonspunktOpen = (statusKode: string): boolean => statusKode === aksjonspunktStatus.OPPRETTET;
