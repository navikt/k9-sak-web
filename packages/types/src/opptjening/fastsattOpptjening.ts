import FastsattOpptjeningAktivitet from './fastsattOpptjeningAktivitet';
import Opptjeningperiode from './opptjeningperiode';

type FastsattOpptjening = Readonly<{
  opptjeningFom: string;
  opptjeningTom: string;
  opptjeningperiode: Opptjeningperiode;
  fastsattOpptjeningAktivitetList: FastsattOpptjeningAktivitet[];
  vurderesIAksjonspunkt: boolean;
}>;

export default FastsattOpptjening;
