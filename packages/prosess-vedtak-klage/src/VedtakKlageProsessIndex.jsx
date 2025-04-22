import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import VedtakKlageForm from './components/VedtakKlageForm';
import vedtakKlageVurderingPropType from './propTypes/vedtakKlageVurderingPropType';
import vedtakKlageBehandlingPropType from './propTypes/vedtakKlageBehandlingPropType';
import vedtakKlageAksjonspunkterPropType from './propTypes/vedtakKlageAksjonspunkterPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const VedtakKlageProsessIndex = ({
  behandling,
  klageVurdering,
  aksjonspunkter,
  submitCallback,
  previewVedtakCallback,
  isReadOnly,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    {klageVurdering ? (
      <VedtakKlageForm
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingsresultat={behandling.behandlingsresultat}
        behandlingPåVent={behandling.behandlingPåVent}
        klageVurdering={klageVurdering}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        previewVedtakCallback={previewVedtakCallback}
        readOnly={isReadOnly}
        alleKodeverk={alleKodeverk}
      />
    ) : null}
  </RawIntlProvider>
);

VedtakKlageProsessIndex.propTypes = {
  behandling: vedtakKlageBehandlingPropType.isRequired,
  klageVurdering: vedtakKlageVurderingPropType,
  aksjonspunkter: PropTypes.arrayOf(vedtakKlageAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default VedtakKlageProsessIndex;
