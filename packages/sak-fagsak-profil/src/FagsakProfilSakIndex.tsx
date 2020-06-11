import React, { FunctionComponent, ReactNode } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { KodeverkMedNavn, Kodeverk } from '@k9-sak-web/types';

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
  saksnummer: number;
  sakstype: Kodeverk;
  fagsakStatus: Kodeverk;
  alleKodeverk: { [key: string]: [KodeverkMedNavn] };
  renderBehandlingMeny: () => ReactNode;
  renderBehandlingVelger: () => ReactNode;
  dekningsgrad?: number;
}

const FagsakProfilSakIndex: FunctionComponent<OwnProps> = ({
  saksnummer,
  sakstype,
  fagsakStatus,
  alleKodeverk,
  renderBehandlingMeny,
  renderBehandlingVelger,
  dekningsgrad,
}) => (
  <RawIntlProvider value={intl}>
    <FagsakProfile
      saksnummer={saksnummer}
      sakstype={sakstype}
      fagsakStatus={fagsakStatus}
      alleKodeverk={alleKodeverk}
      renderBehandlingMeny={renderBehandlingMeny}
      renderBehandlingVelger={renderBehandlingVelger}
      dekningsgrad={dekningsgrad}
    />
  </RawIntlProvider>
);

export default FagsakProfilSakIndex;
