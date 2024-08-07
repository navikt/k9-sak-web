import FagsakYtelseType from '../constants/FagsakYtelseType';

export const erFagsakOLPEllerPLS = (fagsakYtelseType: FagsakYtelseType) =>
  [FagsakYtelseType.OPPLÆRINGSPENGER, FagsakYtelseType.PLEIEPENGER_SLUTTFASE].includes(fagsakYtelseType);
