import type { RelatertYtelseResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';

const K9_YTELSE_TYPER = new Set<RelatertYtelseResponse['ytelseType']>([
  'PSB',
  'PPN',
  'OLP',
  'OMP',
  'OMP_KS',
  'OMP_MA',
  'OMP_AO',
]);

export const kanÅpneRelatertSak = (ytelseType: RelatertYtelseResponse['ytelseType']): boolean =>
  K9_YTELSE_TYPER.has(ytelseType);
