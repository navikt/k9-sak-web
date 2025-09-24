import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import FatterVedtakApprovalModal from './components/modal/FatterVedtakApprovalModal.js';
import type { TotrinnskontrollBehandling } from './types/TotrinnskontrollBehandling.ts';
import { BehandlingResultatType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';

interface FatterVedtakTotrinnskontrollModalSakIndexProps {
  behandling: TotrinnskontrollBehandling;
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
    behandlingsresultatType={behandling.behandlingsresultatType ?? BehandlingResultatType.IKKE_FASTSATT}
    behandlingStatusKode={behandling.status}
    behandlingTypeKode={behandling.type}
    harSammeResultatSomOriginalBehandling={harSammeResultatSomOriginalBehandling}
  />
);

export default FatterVedtakTotrinnskontrollModalSakIndex;
