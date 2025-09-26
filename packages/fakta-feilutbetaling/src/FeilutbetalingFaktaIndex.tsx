import { KodeverkMedUndertype } from '@k9-sak-web/lib/kodeverk/types.js';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import FeilutbetalingInfoPanel from './components/FeilutbetalingInfoPanel';
import { FeilutbetalingAarsak } from './components/feilutbetalingAarsak';
import { FeilutbetalingFakta } from './components/feilutbetalingFakta';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface FeilutbetalingFaktaIndexProps {
  behandling: Behandling;
  feilutbetalingFakta: FeilutbetalingFakta;
  feilutbetalingAarsak: FeilutbetalingAarsak[];
  aksjonspunkter: Aksjonspunkt[];
  alleMerknaderFraBeslutter: {
    [key: string]: {
      notAccepted?: boolean;
    };
  };
  alleKodeverk: KodeverkMedUndertype;
  submitCallback: (data: any) => void;
  readOnly: boolean;
  fagsakYtelseTypeKode: string;
  harApneAksjonspunkter: boolean;
  fpsakKodeverk: KodeverkMedUndertype;
}

const FeilutbetalingFaktaIndex = ({
  behandling,
  feilutbetalingFakta,
  feilutbetalingAarsak,
  fagsakYtelseTypeKode,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  alleKodeverk: tilbakeKodeverk,
  fpsakKodeverk: sakKodeverk,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
}: FeilutbetalingFaktaIndexProps) => (
  <RawIntlProvider value={intl}>
    <FeilutbetalingInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      feilutbetalingFakta={feilutbetalingFakta.behandlingFakta}
      feilutbetalingAarsak={feilutbetalingAarsak.find(a => a.ytelseType === fagsakYtelseTypeKode)}
      aksjonspunkter={aksjonspunkter}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      tilbakeKodeverk={tilbakeKodeverk}
      sakKodeverk={sakKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
    />
  </RawIntlProvider>
);

export default FeilutbetalingFaktaIndex;
