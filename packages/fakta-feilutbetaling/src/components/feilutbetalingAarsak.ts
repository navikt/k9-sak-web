import { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { Kodeverk } from '@k9-sak-web/types';

export interface FeilutbetalingAarsak {
  hendelseTyper: {
    hendelseType: KodeverkObject;
    hendelseUndertyper: Kodeverk[];
  }[];
  ytelseType: string;
}
