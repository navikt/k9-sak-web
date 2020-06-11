import * as React from 'react';
import { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Behandling } from '@k9-sak-web/types';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import messages from '../i18n/nb_NO.json';
import RammevedtakFaktaForm from './components/RammevedtakFaktaForm';

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

const FaktaRammevedtakIndex: FunctionComponent<FaktaRammevedtakIndexProps> = ({ behandling, rammevedtak }) => (
  <RawIntlProvider value={intl}>
    <RammevedtakFaktaForm
      rammevedtak={rammevedtak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
    />
  </RawIntlProvider>
);

export default FaktaRammevedtakIndex;
