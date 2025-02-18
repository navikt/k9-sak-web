import type { TotrinnskontrollSkjermlenkeContextDto } from '@navikt/k9-sak-typescript-client';
import type { TotrinnskontrollAksjonspunkt } from './TotrinnskontrollAksjonspunkt';

export type TotrinnskontrollSkjermlenkeContext = {
  skjermlenkeType: TotrinnskontrollSkjermlenkeContextDto['skjermlenkeType'];
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkt[];
};
