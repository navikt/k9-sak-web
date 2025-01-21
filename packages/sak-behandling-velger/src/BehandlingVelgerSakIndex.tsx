import { BehandlingAppKontekst, Fagsak, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Location } from 'history';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import BehandlingPicker from './components/BehandlingPicker';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

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
    fagsakYtelsesType.FRISINN,
    fagsakYtelsesType.OMP_AO,
    fagsakYtelsesType.OMP_KS,
    fagsakYtelsesType.OMP_MA,
  ].some(sakstype => sakstype === fagsak.sakstype);

  return (
    <RawIntlProvider value={intl}>
      <BehandlingPicker
        behandlinger={behandlinger}
        getBehandlingLocation={getBehandlingLocation}
        noExistingBehandlinger={noExistingBehandlinger}
        getKodeverkFn={getKodeverkFn}
        behandlingId={behandlingId}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
        sakstypeKode={fagsak.sakstype}
        hentSøknadsperioder={hentSøknadsperioder}
      />
    </RawIntlProvider>
  );
};
export default BehandlingVelgerSakIndex;
