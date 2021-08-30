import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Behandling } from '@k9-sak-web/types';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import messages from '../i18n/nb_NO.json';
import OverforingerFaktaForm from './components/OverforingerFaktaForm';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface FaktaRammevedtakIndexProps {
  rammevedtak: Rammevedtak[];
  behandling: Behandling;
}

const FaktaRammevedtakIndex = ({ behandling, rammevedtak }: FaktaRammevedtakIndexProps) => (
  <RawIntlProvider value={intl}>
    <OverforingerFaktaForm
      rammevedtak={rammevedtak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
    />
  </RawIntlProvider>
);

export default FaktaRammevedtakIndex;
