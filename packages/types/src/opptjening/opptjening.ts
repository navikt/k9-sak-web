import type FastsattOpptjening from './fastsattOpptjening';
import type OpptjeningAktivitet from './opptjeningAktivitet';

export type Opptjening = Readonly<{
  fastsattOpptjening: FastsattOpptjening;
  opptjeningAktivitetList: OpptjeningAktivitet[];
}>;

export default Opptjening;
