import Kodeverk from '../kodeverkTsType';

type BeregningAvklaringsbehov = Readonly<{
  definisjon: Kodeverk;
  status: Kodeverk;
  begrunnelse?: string;
  kanLoses: boolean;
}>;

export default BeregningAvklaringsbehov;
