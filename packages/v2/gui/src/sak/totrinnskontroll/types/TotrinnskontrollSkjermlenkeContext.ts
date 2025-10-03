import type { k9_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto as TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { TotrinnskontrollAksjonspunkt } from './TotrinnskontrollAksjonspunkt';

export type TotrinnskontrollSkjermlenkeContext = {
  skjermlenkeType: TotrinnskontrollSkjermlenkeContextDto['skjermlenkeType'];
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkt[];
};
