import PropTypes from 'prop-types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import BehandleResultatForm from './components/BehandleResultatForm';
import ankeResultatAksjonspunkterPropType from './propTypes/ankeResultatAksjonspunkterPropType';
import ankeResultatBehandlingPropType from './propTypes/ankeResultatBehandlingPropType';
import ankeVurderingPropType from './propTypes/ankeVurderingPropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const AnkeResultatProsessIndex = ({
  behandling,
  ankeVurdering,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  saveAnke,
  previewCallback,
  previewVedtakCallback,
}) => (
  <RawIntlProvider value={intl}>
    <BehandleResultatForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      ankeVurderingResultat={ankeVurdering.ankeVurderingResultat}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      saveAnke={saveAnke}
      previewCallback={previewCallback}
      previewVedtakCallback={previewVedtakCallback}
    />
  </RawIntlProvider>
);

AnkeResultatProsessIndex.propTypes = {
  behandling: ankeResultatBehandlingPropType.isRequired,
  ankeVurdering: ankeVurderingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(ankeResultatAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  saveAnke: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
};

export default AnkeResultatProsessIndex;
