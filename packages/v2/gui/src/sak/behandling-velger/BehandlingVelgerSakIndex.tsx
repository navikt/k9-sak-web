import { FagsakDtoSakstype, type FagsakDto } from '@k9-sak-web/backend/k9sak/generated';
import { type Location } from 'history';
import { useContext } from 'react';
import { K9SakClientContext } from '../../app/K9SakClientContext';
import BehandlingVelgerBackendClient from './BehandlingVelgerBackendClient';
import BehandlingPicker from './components/BehandlingPicker';
import type { Behandling } from './types/Behandling';

interface OwnProps {
  behandlinger: Behandling[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  behandlingId?: number;
  fagsak: Pick<FagsakDto, 'sakstype'>;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
}

const BehandlingVelgerSakV2 = ({
  behandlinger,
  getBehandlingLocation,
  noExistingBehandlinger,
  behandlingId,
  fagsak,
  createLocationForSkjermlenke,
}: OwnProps) => {
  const k9SakClient = useContext(K9SakClientContext);
  const behandlingVelgerBackendClient = new BehandlingVelgerBackendClient(k9SakClient);

  const hentSøknadsperioder = ![
    FagsakDtoSakstype.FRISINN,
    FagsakDtoSakstype.OMSORGSPENGER_AO,
    FagsakDtoSakstype.OMSORGSPENGER_KS,
    FagsakDtoSakstype.OMSORGSPENGER_MA,
  ].some(sakstype => sakstype === fagsak.sakstype);

  return (
    <BehandlingPicker
      behandlinger={behandlinger}
      getBehandlingLocation={getBehandlingLocation}
      noExistingBehandlinger={noExistingBehandlinger}
      behandlingId={behandlingId}
      createLocationForSkjermlenke={createLocationForSkjermlenke}
      sakstypeKode={fagsak.sakstype}
      hentSøknadsperioder={hentSøknadsperioder}
      api={behandlingVelgerBackendClient}
    />
  );
};
export default BehandlingVelgerSakV2;
