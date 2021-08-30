import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Location } from 'history';

import { BehandlingAppKontekst, KodeverkMedNavn, Kodeverk } from '@k9-sak-web/types';

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
  behandlinger: BehandlingAppKontekst[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  behandlingId?: number;
  showAll: boolean;
  toggleShowAll: () => void;
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn;
}

const BehandlingVelgerSakIndex = ({
  behandlinger,
  getBehandlingLocation,
  noExistingBehandlinger,
  behandlingId,
  showAll,
  toggleShowAll,
  getKodeverkFn,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <BehandlingPicker
      behandlinger={behandlinger}
      getBehandlingLocation={getBehandlingLocation}
      noExistingBehandlinger={noExistingBehandlinger}
      behandlingId={behandlingId}
      showAll={showAll}
      toggleShowAll={toggleShowAll}
      getKodeverkFn={getKodeverkFn}
    />
  </RawIntlProvider>
);

export default BehandlingVelgerSakIndex;
