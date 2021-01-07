import { Kodeverk } from '@k9-sak-web/types';

type Beregningsresultat = Readonly<{
  beregningResultatPerioder: any[];
  vedtakResultatType: Kodeverk;
}>;

export default Beregningsresultat;
