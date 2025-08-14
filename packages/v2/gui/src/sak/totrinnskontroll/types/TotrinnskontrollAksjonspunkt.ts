import type { k9_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto as TotrinnskontrollAksjonspunkterDto } from '@navikt/k9-sak-typescript-client';
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
