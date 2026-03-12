import {
  Aksjonspunkt,
  Beregningsgrunnlag,
  Personopplysninger,
  SimuleringResultat,
  Soknad,
  Vilkar,
  BeregningsresultatUtbetalt,
  BehandlingPerioderårsakMedVilkår
} from '@k9-sak-web/types';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  beregningsresultatUtbetaling: BeregningsresultatUtbetalt;
  beregningsgrunnlag: Beregningsgrunnlag;
  simuleringResultat: SimuleringResultat;
  forbrukteDager: ÅrskvantumForbrukteDager;
  behandlingPerioderårsakMedVilkår: BehandlingPerioderårsakMedVilkår;
}

export default FetchedData;
