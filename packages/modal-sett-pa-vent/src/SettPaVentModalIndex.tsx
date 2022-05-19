import { Venteaarsak } from '@k9-sak-web/types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import SettPaVentModal from './components/SettPaVentModal';

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
  ventearsaker: Venteaarsak[];
  frist?: string;
  ventearsak?: string;
  visBrevErBestilt?: boolean;
  hasManualPaVent: boolean;
  erTilbakekreving?: boolean;
  ventearsakVariant?: string;
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
  ventearsakVariant,
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
      ventearsakVariant={ventearsakVariant}
    />
  </RawIntlProvider>
);

export default SettPaVentModalIndex;
