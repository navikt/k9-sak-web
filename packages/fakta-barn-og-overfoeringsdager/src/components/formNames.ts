import { Overføringsretning, Overføringstype } from '../types/Overføring';

export const rammevedtakFormName = 'rammevedtakFormName';

export function overføringerFormName(type: Overføringstype, retning: Overføringsretning) {
  return `${rammevedtakFormName}-${type}-${retning}`;
}
