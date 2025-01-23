import { useCallback } from 'react';
import OkAvbrytModal from '../../../shared/okAvbrytModal/OkAvbrytModal';

interface OwnProps {
  fjernVerge?: () => void;
  opprettVerge?: () => void;
  lukkModal: () => void;
}

const MenyVergeIndexV2 = ({ fjernVerge, opprettVerge, lukkModal }: OwnProps) => {
  const submit = useCallback(() => {
    lukkModal();
    const operasjon = opprettVerge || fjernVerge;
    return operasjon?.();
  }, [opprettVerge, fjernVerge]);

  return (
    <OkAvbrytModal
      headerText={opprettVerge ? 'Opprett verge/fullmektig?' : 'Fjern verge/fullmektig?'}
      showModal
      submit={submit}
      cancel={lukkModal}
    />
  );
};

export default MenyVergeIndexV2;
