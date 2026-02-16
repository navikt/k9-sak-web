import type FastsattOpptjeningAktivitet from './fastsattOpptjeningAktivitet';
import type Opptjeningperiode from './opptjeningperiode';

export type FastsattOpptjening = Readonly<{
  opptjeningFom: string;
  opptjeningTom: string;
  opptjeningperiode: Opptjeningperiode;
  fastsattOpptjeningAktivitetList: FastsattOpptjeningAktivitet[];
  vurderesIAksjonspunkt: boolean;
}>;

export default FastsattOpptjening;
