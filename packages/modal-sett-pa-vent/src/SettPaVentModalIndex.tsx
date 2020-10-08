import React, { FunctionComponent } from 'react';
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
  originalFrist?: string;
  ventearsak?: string;
  originalVentearsak?: string;
  visBrevErBestilt?: boolean;
  hasManualPaVent: boolean;
  erTilbakekreving?: boolean;
}

const SettPaVentModalIndex: FunctionComponent<OwnProps> = ({
  cancelEvent,
  submitCallback,
  showModal,
  ventearsaker,
  frist,
  originalFrist,
  ventearsak,
  originalVentearsak,
  visBrevErBestilt,
  hasManualPaVent,
  erTilbakekreving,
}) => (
  <RawIntlProvider value={intl}>
    <SettPaVentModal
      cancelEvent={cancelEvent}
      onSubmit={submitCallback}
      showModal={showModal}
      ventearsaker={ventearsaker}
      frist={frist}
      originalFrist={originalFrist}
      ventearsak={ventearsak}
      originalVentearsak={originalVentearsak}
      visBrevErBestilt={visBrevErBestilt}
      hasManualPaVent={hasManualPaVent}
      erTilbakekreving={erTilbakekreving}
    />
  </RawIntlProvider>
);

export default SettPaVentModalIndex;
