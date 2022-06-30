import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { BehandlingAppKontekst, Kodeverk } from '@k9-sak-web/types';
import FatterVedtakApprovalModal from './components/modal/FatterVedtakApprovalModal';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  behandling: BehandlingAppKontekst;
  closeEvent: () => void;
  allAksjonspunktApproved: boolean;
  fagsakYtelseType: string;
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
      behandlingStatusKode={behandling.status}
      behandlingTypeKode={behandling.type}
      harSammeResultatSomOriginalBehandling={harSammeResultatSomOriginalBehandling}
    />
  </RawIntlProvider>
);

export default FatterVedtakTotrinnskontrollModalSakIndex;
