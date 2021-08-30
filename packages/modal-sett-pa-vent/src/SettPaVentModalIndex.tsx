import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { KodeverkMedNavn } from '@k9-sak-web/types';

import SettPaVentModal from './components/SettPaVentModal';
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
  cancelEvent: () => void;
  submitCallback: (formData: any) => void;
  showModal: boolean;
  ventearsaker: KodeverkMedNavn[];
  frist?: string;
  ventearsak?: string;
  visBrevErBestilt?: boolean;
  hasManualPaVent: boolean;
  erTilbakekreving?: boolean;
}

const SettPaVentModalIndex = ({
  cancelEvent,
  submitCallback,
  showModal,
  ventearsaker,
  frist,
  ventearsak,
  visBrevErBestilt,
  hasManualPaVent,
  erTilbakekreving,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <SettPaVentModal
      cancelEvent={cancelEvent}
      onSubmit={submitCallback}
      showModal={showModal}
      ventearsaker={ventearsaker}
      frist={frist}
      ventearsak={ventearsak}
      visBrevErBestilt={visBrevErBestilt}
      hasManualPaVent={hasManualPaVent}
      erTilbakekreving={erTilbakekreving}
    />
  </RawIntlProvider>
);

export default SettPaVentModalIndex;
