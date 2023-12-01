import * as messages from '../nb_NO';
import Ytelsestype from '../types/Ytelsestype';

// eslint-disable-next-line import/prefer-default-export
export const teksterForSakstype = (sakstype: string) => {
  if (sakstype === Ytelsestype.PSB) {
    return messages.pleiepenger;
  }

  if (sakstype === Ytelsestype.OMP) {
    return messages.omsorgspenger;
  }
  return messages.pleiepenger;
};
