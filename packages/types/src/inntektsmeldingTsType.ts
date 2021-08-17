import Kodeverk from './kodeverkTsType';

type Inntektsmelding = Readonly<{
  journalpostId?: string;
  mottattTidspunkt?: string;
  status?: Kodeverk;
  begrunnelse?: string;
}>;

export default Inntektsmelding;
