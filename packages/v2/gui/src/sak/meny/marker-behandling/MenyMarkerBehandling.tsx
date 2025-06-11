/* eslint-disable arrow-body-style */
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import { useContext } from 'react';
import MarkerBehandlingModal from './components/MarkerBehandlingModal';
import MarkerBehandlingBackendClient from './MarkerBehandlingBackendClient';

interface OwnProps {
  lukkModal: () => void;
  brukHastekøMarkering?: boolean;
  behandlingUuid: string;
  erVeileder?: boolean;
}

const MenyMarkerBehandlingV2 = ({ lukkModal, brukHastekøMarkering, behandlingUuid, erVeileder }: OwnProps) => {
  const k9SakClient = useContext(K9SakClientContext);
  const markerBehandlingBackendClient = new MarkerBehandlingBackendClient(k9SakClient);
  return (
    <MarkerBehandlingModal
      lukkModal={lukkModal}
      brukHastekøMarkering={brukHastekøMarkering}
      behandlingUuid={behandlingUuid}
      erVeileder={erVeileder}
      api={markerBehandlingBackendClient}
    />
  );
};

export default MenyMarkerBehandlingV2;
