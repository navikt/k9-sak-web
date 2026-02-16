import type Kodeverk from './kodeverkTsType';

export type Inntektsmelding = Readonly<{
  journalpostId?: string;
  mottattTidspunkt?: string;
  status?: Kodeverk;
  begrunnelse?: string;
}>;

export default Inntektsmelding;
