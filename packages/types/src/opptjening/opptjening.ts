import OpptjeningAktivitet from './opptjeningAktivitet';
import FastsattOpptjening from './fastsattOpptjening';

export type Opptjening = Readonly<{
  fastsattOpptjening: FastsattOpptjening;
  opptjeningAktivitetList: OpptjeningAktivitet[];
}>;

export default Opptjening;
