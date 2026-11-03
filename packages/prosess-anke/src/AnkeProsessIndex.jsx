import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandleAnkeForm from './components/BehandleAnkeForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const AnkeProsessIndex = ({
  behandling,
  ankeVurdering,
  behandlinger,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  saveAnke,
  previewCallback,
  previewVedtakCallback,
}) => (
  <RawIntlProvider value={intl}>
    <BehandleAnkeForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      språkkode={behandling.språkkode}
      ankeVurderingResultat={ankeVurdering ? ankeVurdering.ankeVurderingResultat : {}}
      behandlinger={behandlinger}
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

export default AnkeProsessIndex;
