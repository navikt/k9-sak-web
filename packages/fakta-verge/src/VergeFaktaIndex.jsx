import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import messages from '../i18n/nb_NO.json';
import RegistrereVergeInfoPanel from './components/RegistrereVergeInfoPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const VergeFaktaIndex = ({
  behandling,
  verge = {},
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
  submittable,
}) => (
  <RawIntlProvider value={intl}>
    <RegistrereVergeInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      verge={verge}
      aksjonspunkter={aksjonspunkter}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
      submittable={submittable}
    />
  </RawIntlProvider>
);

export default VergeFaktaIndex;
