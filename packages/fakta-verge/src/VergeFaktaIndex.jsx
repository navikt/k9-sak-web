import PropTypes from 'prop-types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import messages from '../i18n/nb_NO.json';
import RegistrereVergeInfoPanel from './components/RegistrereVergeInfoPanel';
import vergeAksjonspunkterPropType from './propTypes/vergeAksjonspunkterPropType';
import vergeBehandlingPropType from './propTypes/vergeBehandlingPropType';
import vergeVergePropType from './propTypes/vergeVergePropType';

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

VergeFaktaIndex.propTypes = {
  behandling: vergeBehandlingPropType.isRequired,
  verge: vergeVergePropType,
  aksjonspunkter: PropTypes.arrayOf(vergeAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default VergeFaktaIndex;
