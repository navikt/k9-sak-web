import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import OmsorgenForInfoPanel from './components/OmsorgenForInfoPanel';
import messages from '../i18n/nb_NO.json';

interface OmsorgenForFaktaIndexProps {
  behandling: {
    id: number,
    versjon: number,
  };
  aksjonspunkter: [];
  openInfoPanels: string[];
  toggleInfoPanelCallback: (value: any) => any; // FIXME: hva er types?
  shouldOpenDefaultInfoPanels: boolean;
  readOnly: boolean;
}

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const OmsorgenForFaktaIndex: FunctionComponent<OmsorgenForFaktaIndexProps> = ({
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
