import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
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

const FatterVedtakTotrinnskontrollModalSakIndexPropsTransformer = (
  props: FatterVedtakTotrinnskontrollModalSakIndexProps,
) => {
  const v2Props = JSON.parse(JSON.stringify(props));
  konverterKodeverkTilKode(v2Props, false);
  return <FatterVedtakTotrinnskontrollModalSakIndex {...props} {...v2Props} />;
};

export default FatterVedtakTotrinnskontrollModalSakIndexPropsTransformer;
