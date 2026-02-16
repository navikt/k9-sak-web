import type ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import type {
  Aksjonspunkt,
  BehandlingPerioderårsakMedVilkår,
  Beregningsgrunnlag,
  BeregningsresultatUtbetalt,
  Personopplysninger,
  SimuleringResultat,
  Soknad,
  Vilkar,
} from '@k9-sak-web/types';

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
