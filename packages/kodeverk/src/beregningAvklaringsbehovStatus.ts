const avklaringsbehovStatus = {
  OPPRETTET: 'OPPR',
  UTFORT: 'UTFO',
  AVBRUTT: 'AVBR',
};

export default avklaringsbehovStatus;

export const isAvklaringsbehovOpen = (statusKode: string): boolean => statusKode === avklaringsbehovStatus.OPPRETTET;
