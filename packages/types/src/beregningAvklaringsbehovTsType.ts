import Kodeverk from './kodeverkTsType';

type BeregningAvklaringsbehov = Readonly<{
  definisjon: Kodeverk;
  status: Kodeverk;
  begrunnelse?: string;
}>;

export default BeregningAvklaringsbehov;
