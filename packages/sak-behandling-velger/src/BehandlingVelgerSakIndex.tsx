import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { BehandlingAppKontekst, Fagsak, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Location } from 'history';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
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
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
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
          getKodeverkFn={getKodeverkFn}
        />
      ) : (
        <BehandlingPicker
          behandlinger={behandlinger}
          getBehandlingLocation={getBehandlingLocation}
          noExistingBehandlinger={noExistingBehandlinger}
          getKodeverkFn={getKodeverkFn}
          behandlingId={behandlingId}
          createLocationForSkjermlenke={createLocationForSkjermlenke}
          sakstypeKode={fagsak.sakstype}
        />
      )}
    </RawIntlProvider>
  );
};
export default BehandlingVelgerSakIndex;
