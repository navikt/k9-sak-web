import OpptjeningAktivitet from './opptjeningAktivitet';
import FastsattOpptjening from './fastsattOpptjening';

type Opptjening = Readonly<{
  fastsattOpptjening: FastsattOpptjening;
  opptjeningAktivitetList: OpptjeningAktivitet[];
}>;

export default Opptjening;
