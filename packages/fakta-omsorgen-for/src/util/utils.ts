import * as messages from '../nb_NO';
import Ytelsestype from '../types/Ytelsestype';

export const teksterForSakstype = (sakstype: string) => {
  if (sakstype === Ytelsestype.PSB) {
    return messages.pleiepenger;
  }

  if (sakstype === Ytelsestype.OMP) {
    return messages.omsorgspenger;
  }
  return messages.pleiepenger;
};
