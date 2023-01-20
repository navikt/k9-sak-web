import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import AvregningPanel from './components/AvregningPanel';
import messages from '../i18n/nb_NO.json';
import avregningFagsakPropType from './propTypes/avregningFagsakPropType';
import avregningBehandlingPropType from './propTypes/avregningBehandlingPropType';
import avregningAksjonspunkterPropType from './propTypes/avregningAksjonspunkterPropType';
import avregningSimuleringResultatPropType from './propTypes/avregningSimuleringResultatPropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const AvregningProsessIndex = ({
  fagsak,
  behandling,
  aksjonspunkter,
  simuleringResultat,
  tilbakekrevingvalg,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  isAksjonspunktOpen,
  previewFptilbakeCallback,
  featureToggles,
}) => (
  <RawIntlProvider value={intl}>
    <AvregningPanel
      fagsak={fagsak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      sprakkode={behandling.sprakkode}
      aksjonspunkter={aksjonspunkter}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      apCodes={aksjonspunkter.map(a => a.definisjon.kode)}
      isApOpen={isAksjonspunktOpen}
      previewCallback={previewFptilbakeCallback}
      featureToggles={featureToggles}
    />
  </RawIntlProvider>
);

AvregningProsessIndex.propTypes = {
  fagsak: avregningFagsakPropType.isRequired,
  behandling: avregningBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(avregningAksjonspunkterPropType).isRequired,
  simuleringResultat: avregningSimuleringResultatPropType,
  tilbakekrevingvalg: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  previewFptilbakeCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  featureToggles: PropTypes.shape(),
};

AvregningProsessIndex.defaultProps = {
  simuleringResultat: undefined,
  tilbakekrevingvalg: undefined,
};

export default AvregningProsessIndex;
