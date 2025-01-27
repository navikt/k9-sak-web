import { FagsakDtoSakstype, type FagsakDto } from '@k9-sak-web/backend/k9sak/generated';
import { type Location } from 'history';
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
    />
  );
};
export default BehandlingVelgerSakV2;
