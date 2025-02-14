import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import FatterVedtakApprovalModal from './components/modal/FatterVedtakApprovalModal';
import { Behandling } from './types/Behandling';

interface FatterVedtakTotrinnskontrollModalSakIndexProps {
  behandling: Behandling;
  closeEvent: () => void;
  allAksjonspunktApproved: boolean;
  fagsakYtelseType: FagsakYtelsesType;
  erKlageWithKA?: boolean;
  harSammeResultatSomOriginalBehandling?: boolean;
}

const FatterVedtakTotrinnskontrollModalSakIndex = ({
  behandling,
  closeEvent,
  allAksjonspunktApproved,
  fagsakYtelseType,
  erKlageWithKA,
  harSammeResultatSomOriginalBehandling = false,
}: FatterVedtakTotrinnskontrollModalSakIndexProps) => (
  <FatterVedtakApprovalModal
    closeEvent={closeEvent}
    allAksjonspunktApproved={allAksjonspunktApproved}
    fagsakYtelseType={fagsakYtelseType}
    erKlageWithKA={erKlageWithKA}
    behandlingsresultat={behandling.behandlingsresultat}
    behandlingStatusKode={behandling.status}
    behandlingTypeKode={behandling.type}
    harSammeResultatSomOriginalBehandling={harSammeResultatSomOriginalBehandling}
  />
);

export default FatterVedtakTotrinnskontrollModalSakIndex;
