import type { k9_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto as TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { OpptjeningAktivitet } from './OpptjeningAktivitet';

export type TotrinnskontrollAksjonspunkt = {
  aksjonspunktKode: string;
  arbeidsforholdDtos: TotrinnskontrollAksjonspunkterDto['arbeidsforholdDtos'];
  beregningDtoer: TotrinnskontrollAksjonspunkterDto['beregningDtoer'];
  besluttersBegrunnelse?: string;
  opptjeningAktiviteter?: OpptjeningAktivitet[];
  totrinnskontrollGodkjent?: boolean;
  vurderPaNyttArsaker: TotrinnskontrollAksjonspunkterDto['vurderPaNyttArsaker'];
};
