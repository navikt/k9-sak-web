import { TotrinnskontrollAksjonspunkterDto } from '@navikt/k9-sak-typescript-client';
import { OpptjeningAktivitet } from './OpptjeningAktivitet';

export type TotrinnskontrollAksjonspunkt = {
  aksjonspunktKode: string;
  arbeidsforholdDtos: TotrinnskontrollAksjonspunkterDto['arbeidsforholdDtos'];
  beregningDtoer: TotrinnskontrollAksjonspunkterDto['beregningDtoer'];
  besluttersBegrunnelse?: string;
  opptjeningAktiviteter?: OpptjeningAktivitet[];
  totrinnskontrollGodkjent?: boolean;
  vurderPaNyttArsaker: TotrinnskontrollAksjonspunkterDto['vurderPaNyttArsaker'];
};
