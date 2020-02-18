import { Kodeverk } from '@k9-sak-web/types';

type Beregningsresultat = Readonly<{
  beregningResultatPerioder: {}[];
  vedtakResultatType: Kodeverk;
}>;

export default Beregningsresultat;
