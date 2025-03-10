/* eslint-disable arrow-body-style */
import type { MerknadDto } from '@k9-sak-web/backend/k9sak/generated';
import MarkerBehandlingModal from './components/MarkerBehandlingModal';

interface OwnProps {
  lukkModal: () => void;
  brukHastekøMarkering?: boolean;
  brukVanskeligKøMarkering?: boolean;
  markerBehandling: (values: any) => Promise<any>;
  behandlingUuid: string;
  merknaderFraLos: MerknadDto;
  erVeileder?: boolean;
}

const MenyMarkerBehandlingV2 = ({
  lukkModal,
  brukHastekøMarkering,
  brukVanskeligKøMarkering,
  markerBehandling,
  behandlingUuid,
  merknaderFraLos,
  erVeileder,
}: OwnProps) => {
  return (
    <MarkerBehandlingModal
      lukkModal={lukkModal}
      brukHastekøMarkering={brukHastekøMarkering}
      brukVanskeligKøMarkering={brukVanskeligKøMarkering}
      markerBehandling={markerBehandling}
      behandlingUuid={behandlingUuid}
      merknaderFraLos={merknaderFraLos}
      erVeileder={erVeileder}
    />
  );
};

export default MenyMarkerBehandlingV2;
