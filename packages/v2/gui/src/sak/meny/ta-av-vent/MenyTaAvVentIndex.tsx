import { useCallback } from 'react';
import OkAvbrytModal from '../../../shared/okAvbrytModal/OkAvbrytModal';

interface OwnProps {
  behandlingId: number;
  behandlingUuid: string;
  behandlingVersjon: number;
  taBehandlingAvVent: (params: { behandlingId: number; behandlingUuid: string; behandlingVersjon: number }) => void;
  lukkModal: () => void;
}

export const MenyTaAvVentIndexV2 = ({
  behandlingId,
  behandlingUuid,
  behandlingVersjon,
  taBehandlingAvVent,
  lukkModal,
}: OwnProps) => {
  const submit = useCallback(() => {
    taBehandlingAvVent({
      behandlingUuid,
      behandlingId,
      behandlingVersjon,
    });

    lukkModal();
  }, [behandlingId, behandlingUuid, behandlingVersjon, lukkModal, taBehandlingAvVent]);

  return <OkAvbrytModal headerText="Ta behandlingen av vent?" showModal submit={submit} cancel={lukkModal} />;
};

export default MenyTaAvVentIndexV2;
