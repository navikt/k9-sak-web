import { useCallback } from 'react';
import OkAvbrytModal from '../../../shared/okAvbrytModal/OkAvbrytModal';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  taBehandlingAvVent: (params: { behandlingId: number; behandlingVersjon: number }) => void;
  lukkModal: () => void;
}

export const MenyTaAvVentIndexV2 = ({ behandlingId, behandlingVersjon, taBehandlingAvVent, lukkModal }: OwnProps) => {
  const submit = useCallback(() => {
    taBehandlingAvVent({
      behandlingId,
      behandlingVersjon,
    });

    lukkModal();
  }, [behandlingId, behandlingVersjon]);

  return <OkAvbrytModal headerText="Ta behandlingen av vent?" showModal submit={submit} cancel={lukkModal} />;
};

export default MenyTaAvVentIndexV2;
