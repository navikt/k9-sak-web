import MarkerBehandlingModal from './components/MarkerBehandlingModal';
import MarkerBehandlingBackendClient from './MarkerBehandlingBackendClient';

interface OwnProps {
  lukkModal: () => void;
  behandlingUuid: string;
  erVeileder?: boolean;
}

const MenyMarkerBehandlingV2 = ({ lukkModal, behandlingUuid, erVeileder }: OwnProps) => {
  const markerBehandlingBackendClient = new MarkerBehandlingBackendClient();
  return (
    <MarkerBehandlingModal
      lukkModal={lukkModal}
      behandlingUuid={behandlingUuid}
      erVeileder={erVeileder}
      api={markerBehandlingBackendClient}
    />
  );
};

export default MenyMarkerBehandlingV2;
