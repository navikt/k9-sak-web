import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { BehandlingAppKontekst, Fagsak, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Location } from 'history';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import BehandlingPicker from './components/BehandlingPicker';

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
  fagsak: Fagsak;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
}

const BehandlingVelgerSakIndex = ({
  behandlinger,
  getBehandlingLocation,
  noExistingBehandlinger,
  getKodeverkFn,
  behandlingId,
  fagsak,
  createLocationForSkjermlenke,
}: OwnProps) => {
  const hentSøknadsperioder = ![
    fagsakYtelseType.FRISINN,
    fagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN,
    fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN,
    fagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE,
  ].includes(fagsak.sakstype.kode);

  return (
    <RawIntlProvider value={intl}>
      <BehandlingPicker
        behandlinger={behandlinger}
        getBehandlingLocation={getBehandlingLocation}
        noExistingBehandlinger={noExistingBehandlinger}
        getKodeverkFn={getKodeverkFn}
        behandlingId={behandlingId}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
        sakstypeKode={fagsak.sakstype.kode}
        hentSøknadsperioder={hentSøknadsperioder}
      />
    </RawIntlProvider>
  );
};
export default BehandlingVelgerSakIndex;
