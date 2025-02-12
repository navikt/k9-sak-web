import FastsattOpptjeningAktivitet from './fastsattOpptjeningAktivitet';
import Opptjeningperiode from './opptjeningperiode';

export type FastsattOpptjening = Readonly<{
  opptjeningFom: string;
  opptjeningTom: string;
  opptjeningperiode: Opptjeningperiode;
  fastsattOpptjeningAktivitetList: FastsattOpptjeningAktivitet[];
  vurderesIAksjonspunkt: boolean;
}>;

export default FastsattOpptjening;
