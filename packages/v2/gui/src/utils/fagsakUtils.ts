import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import { k9_kodeverk_behandling_FagsakYtelseType } from '@k9-sak-web/backend/k9sak/generated/types.js';

export const isUngFagsak = (fagsak: FagsakDto): boolean =>
  fagsak.sakstype === k9_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE;
