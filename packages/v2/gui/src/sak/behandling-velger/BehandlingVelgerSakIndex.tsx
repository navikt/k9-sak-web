import {
  k9_kodeverk_behandling_FagsakYtelseType as FagsakDtoSakstype,
  type k9_sak_kontrakt_fagsak_FagsakDto as FagsakDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { type Location } from 'history';
import type { BehandlingVelgerBackendApiType } from './BehandlingVelgerBackendApiType';
import BehandlingPicker from './components/BehandlingPicker';
import type { Behandling } from './types/Behandling';

interface OwnProps {
  behandlinger: Behandling[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  behandlingId?: number;
  fagsak: Pick<FagsakDto, 'sakstype'>;
  api: BehandlingVelgerBackendApiType;
}

const BehandlingVelgerSakV2 = ({
  behandlinger,
  getBehandlingLocation,
  noExistingBehandlinger,
  behandlingId,
  fagsak,
  api,
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
      sakstypeKode={fagsak.sakstype}
      hentSøknadsperioder={hentSøknadsperioder}
      api={api}
    />
  );
};
export default BehandlingVelgerSakV2;
