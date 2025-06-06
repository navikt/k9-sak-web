import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export const erFagsakOLPEllerPLS = (fagsakYtelseType: FagsakYtelsesType | undefined) =>
  [fagsakYtelsesType.OPPLÆRINGSPENGER, fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE].some(
    ytelseType => ytelseType === fagsakYtelseType,
  );
