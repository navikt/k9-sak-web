import {
  Aksjonspunkt,
  FeilutbetalingFakta,
  FeilutbetalingPerioderWrapper,
  BeregningsresultatTilbakekreving,
} from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  perioderForeldelse: FeilutbetalingPerioderWrapper;
  beregningsresultat: BeregningsresultatTilbakekreving;
  feilutbetalingFakta: FeilutbetalingFakta;
}

export default FetchedData;
