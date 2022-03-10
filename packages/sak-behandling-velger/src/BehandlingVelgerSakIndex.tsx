import { BehandlingAppKontekst, Kodeverk, KodeverkMedNavn, Fagsak, FeatureToggles } from '@k9-sak-web/types';
import { Location } from 'history';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import messages from '../i18n/nb_NO.json';
import BehandlingPicker from './components/BehandlingPicker';
import BehandlingPickerOld from './components/BehandlingPickerOld';

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
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn;
  showAll: boolean;
  toggleShowAll: () => void;
  fagsak: Fagsak;
  featureToggles: FeatureToggles;
}

const BehandlingVelgerSakIndex = ({
  behandlinger,
  getBehandlingLocation,
  noExistingBehandlinger,
  getKodeverkFn,
  behandlingId,
  showAll,
  toggleShowAll,
  fagsak,
  featureToggles,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    {fagsak.sakstype === fagsakYtelseType.FRISINN || !featureToggles?.BEHANDLINGSVELGER_NY ? (
      <BehandlingPickerOld
        behandlinger={behandlinger}
        getBehandlingLocation={getBehandlingLocation}
        noExistingBehandlinger={noExistingBehandlinger}
        behandlingId={behandlingId}
        showAll={showAll}
        toggleShowAll={toggleShowAll}
        getKodeverkFn={getKodeverkFn}
      />
    ) : (
      <BehandlingPicker
        behandlinger={behandlinger}
        getBehandlingLocation={getBehandlingLocation}
        noExistingBehandlinger={noExistingBehandlinger}
        getKodeverkFn={getKodeverkFn}
        behandlingId={behandlingId}
      />
    )}
  </RawIntlProvider>
);

export default BehandlingVelgerSakIndex;
