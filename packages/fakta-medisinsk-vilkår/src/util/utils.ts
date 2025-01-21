import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export const erFagsakOLPEllerPLS = (fagsakYtelseType: FagsakYtelsesType) =>
  [fagsakYtelsesType.OLP, fagsakYtelsesType.PPN].some(ytelseType => ytelseType === fagsakYtelseType);
