import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { Location } from 'history';
import React from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
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
  showAll: boolean;
  toggleShowAll: () => void;
  fagsak: Fagsak;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
}

const BehandlingVelgerSakIndex = ({
  behandlinger,
  getBehandlingLocation,
  noExistingBehandlinger,
  behandlingId,
  showAll,
  toggleShowAll,
  fagsak,
  createLocationForSkjermlenke,
}: OwnProps) => {
  const skalViseGammelBehandlingsvelger =
    fagsak.sakstype === fagsakYtelseType.FRISINN ||
    fagsak.sakstype === fagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN ||
    fagsak.sakstype === fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN ||
    fagsak.sakstype === fagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE;
  return (
    <RawIntlProvider value={intl}>
      {skalViseGammelBehandlingsvelger ? (
        <BehandlingPickerOld
          behandlinger={behandlinger}
          getBehandlingLocation={getBehandlingLocation}
          noExistingBehandlinger={noExistingBehandlinger}
          behandlingId={behandlingId}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
        />
      ) : (
        <BehandlingPicker
          behandlinger={behandlinger}
          getBehandlingLocation={getBehandlingLocation}
          noExistingBehandlinger={noExistingBehandlinger}
          behandlingId={behandlingId}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          sakstypeKode={fagsak.sakstype}
        />
      )}
    </RawIntlProvider>
  );
};
export default BehandlingVelgerSakIndex;
