/* eslint-disable arrow-body-style */
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import { useContext } from 'react';
import MarkerBehandlingModal from './components/MarkerBehandlingModal';
import MarkerBehandlingBackendClient from './MarkerBehandlingBackendClient';
import type { MerknaderFraLos } from './MerknaderFraLos';

interface OwnProps {
  lukkModal: () => void;
  brukHastekøMarkering?: boolean;
  markerBehandling: (values: any) => Promise<any>;
  behandlingUuid: string;
  merknaderFraLos: MerknaderFraLos[];
  erVeileder?: boolean;
}

const MenyMarkerBehandlingV2 = ({
  lukkModal,
  brukHastekøMarkering,
  markerBehandling,
  behandlingUuid,
  merknaderFraLos,
  erVeileder,
}: OwnProps) => {
  const k9SakClient = useContext(K9SakClientContext);
  const markerBehandlingBackendClient = new MarkerBehandlingBackendClient(k9SakClient);
  return (
    <MarkerBehandlingModal
      lukkModal={lukkModal}
      brukHastekøMarkering={brukHastekøMarkering}
      markerBehandling={markerBehandling}
      behandlingUuid={behandlingUuid}
      merknaderFraLos={merknaderFraLos}
      erVeileder={erVeileder}
      api={markerBehandlingBackendClient}
    />
  );
};

export default MenyMarkerBehandlingV2;
