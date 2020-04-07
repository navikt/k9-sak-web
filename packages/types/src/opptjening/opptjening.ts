import OpptjeningAktivitet from './opptjeningAktivitet';

type Opptjening = Readonly<{
  fastsattOpptjening: OpptjeningAktivitet;
  opptjeningAktivitetList: OpptjeningAktivitet[];
}>;

export default Opptjening;
