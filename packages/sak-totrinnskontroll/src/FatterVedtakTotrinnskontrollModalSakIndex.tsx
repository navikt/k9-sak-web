import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import FatterVedtakApprovalModal from './components/modal/FatterVedtakApprovalModal';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
  },
  cache,
);

interface OwnProps {
  behandling: BehandlingAppKontekst;
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
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <FatterVedtakApprovalModal
      closeEvent={closeEvent}
      allAksjonspunktApproved={allAksjonspunktApproved}
      fagsakYtelseType={fagsakYtelseType}
      erKlageWithKA={erKlageWithKA}
      behandlingsresultat={behandling.behandlingsresultat}
      behandlingStatusKode={behandling.status.kode}
      behandlingTypeKode={behandling.type.kode}
      harSammeResultatSomOriginalBehandling={harSammeResultatSomOriginalBehandling}
    />
  </RawIntlProvider>
);

export default FatterVedtakTotrinnskontrollModalSakIndex;
