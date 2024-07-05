import React, { ReactNode } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FagsakProfile from './components/FagsakProfile';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  saksnummer: string;
  fagsakYtelseType: string;
  fagsakStatus: string;
  renderBehandlingMeny: () => ReactNode;
  renderBehandlingVelger: () => ReactNode;
  dekningsgrad?: number;
}

const FagsakProfilSakIndex = ({
  saksnummer,
  fagsakYtelseType,
  fagsakStatus,
  renderBehandlingMeny,
  renderBehandlingVelger,
  dekningsgrad,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <FagsakProfile
      saksnummer={saksnummer}
      fagsakYtelseType={fagsakYtelseType}
      fagsakStatus={fagsakStatus}
      renderBehandlingMeny={renderBehandlingMeny}
      renderBehandlingVelger={renderBehandlingVelger}
      dekningsgrad={dekningsgrad}
    />
  </RawIntlProvider>
);

export default FagsakProfilSakIndex;
