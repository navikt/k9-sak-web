import type Kodeverk from '../kodeverkTsType';

export type FastsattOpptjeningAktivitet = Readonly<{
  aktivitetReferanse: string;
  arbeidsgiverNavn: string;
  fom: string;
  klasse: Kodeverk;
  tom: string;
  type: string;
}>;

export default FastsattOpptjeningAktivitet;
