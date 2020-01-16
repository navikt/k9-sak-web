import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Kodeverk, Behandlingsresultat } from '@fpsak-frontend/types';
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

const FatterVedtakApprovalModalSakIndex = ({
  showModal,
  closeEvent,
  allAksjonspunktApproved,
  fagsakYtelseType,
  erGodkjenningFerdig,
  erKlageWithKA,
  behandlingsresultat,
  behandlingId,
  behandlingStatusKode,
  behandlingTypeKode,
  harSammeResultatSomOriginalBehandling,
}: FatterVedtakApprovalModalSakIndexProps) => (
  <RawIntlProvider value={intl}>
    <FatterVedtakApprovalModal
      showModal={showModal}
      closeEvent={closeEvent}
      allAksjonspunktApproved={allAksjonspunktApproved}
      fagsakYtelseType={fagsakYtelseType}
      erGodkjenningFerdig={erGodkjenningFerdig}
      erKlageWithKA={erKlageWithKA}
      behandlingsresultat={behandlingsresultat}
      behandlingId={behandlingId}
      behandlingStatusKode={behandlingStatusKode}
      behandlingTypeKode={behandlingTypeKode}
      harSammeResultatSomOriginalBehandling={harSammeResultatSomOriginalBehandling}
    />
  </RawIntlProvider>
);

interface FatterVedtakApprovalModalSakIndexProps {
  showModal: boolean;
  closeEvent: () => void;
  allAksjonspunktApproved: boolean;
  fagsakYtelseType: Kodeverk;
  erGodkjenningFerdig: boolean;
  erKlageWithKA?: boolean;
  behandlingsresultat: Behandlingsresultat;
  behandlingId: number;
  behandlingStatusKode: string;
  behandlingTypeKode: string;
  harSammeResultatSomOriginalBehandling?: boolean;
}

export default FatterVedtakApprovalModalSakIndex;
