import { type FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { getUngSakClient } from '../ungsak/client.js';
import { getK9SakClient } from '../k9sak/client.js';

export const getSakClient = (sakstype: FagsakYtelsesType) => {
  return sakstype === fagsakYtelsesType.UNGDOMSYTELSE ? getUngSakClient() : getK9SakClient();
};
