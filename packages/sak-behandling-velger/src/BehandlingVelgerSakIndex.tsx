import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';

import BehandlingPicker from './components/BehandlingPicker';
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
  behandlinger: Behandling[];
  getBehandlingLocation: (behandlingId: number) => void;
  noExistingBehandlinger: boolean;
  behandlingId?: number;
  showAll: boolean;
  toggleShowAll: () => void;
  alleKodeverk: { [key: string]: [KodeverkMedNavn] };
  klagekodeverk?: { [key: string]: [KodeverkMedNavn] };
}

const BehandlingVelgerSakIndex: FunctionComponent<OwnProps> = ({
  behandlinger,
  getBehandlingLocation,
  noExistingBehandlinger,
  behandlingId,
  showAll,
  toggleShowAll,
  alleKodeverk,
  klagekodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <BehandlingPicker
      behandlinger={behandlinger}
      getBehandlingLocation={getBehandlingLocation}
      noExistingBehandlinger={noExistingBehandlinger}
      behandlingId={behandlingId}
      showAll={showAll}
      toggleShowAll={toggleShowAll}
      alleKodeverk={alleKodeverk}
      klagekodeverk={klagekodeverk}
    />
  </RawIntlProvider>
);

export default BehandlingVelgerSakIndex;
