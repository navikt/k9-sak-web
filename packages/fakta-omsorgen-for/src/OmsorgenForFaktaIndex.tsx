import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import OmsorgenForInfoPanel from './components/OmsorgenForInfoPanel';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const OmsorgenForFaktaIndex = ({
  behandling,
  aksjonspunkter,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <OmsorgenForInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      aksjonspunkter={aksjonspunkter}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

export default OmsorgenForFaktaIndex;
