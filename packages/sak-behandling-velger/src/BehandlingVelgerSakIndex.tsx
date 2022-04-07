import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { BehandlingAppKontekst, Fagsak, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Location } from 'history';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
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
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn;
  showAll: boolean;
  toggleShowAll: () => void;
  fagsak: Fagsak;
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
}: OwnProps) => {
  const skalViseGammelBehandlingsvelger =
    fagsak.sakstype.kode === fagsakYtelseType.FRISINN ||
    fagsak.sakstype.kode === fagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN ||
    fagsak.sakstype.kode === fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN ||
    fagsak.sakstype.kode === fagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE;
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
        />
      )}
    </RawIntlProvider>
  );
};
export default BehandlingVelgerSakIndex;
