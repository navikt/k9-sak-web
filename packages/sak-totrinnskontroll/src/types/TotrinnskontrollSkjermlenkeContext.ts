import { TotrinnskontrollSkjermlenkeContextDto } from '@navikt/k9-sak-typescript-client';
import { TotrinnskontrollAksjonspunkt } from './TotrinnskontrollAksjonspunkt';

export type TotrinnskontrollSkjermlenkeContext = {
  skjermlenkeType: TotrinnskontrollSkjermlenkeContextDto['skjermlenkeType'];
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkt[];
};
