import * as React from 'react';
import { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Behandling } from '@k9-sak-web/types';
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
  behandling: Behandling;
  submitCallback: VoidFunction;
  readOnly?: boolean;
}

const FaktaRammevedtakIndex: FunctionComponent<FaktaRammevedtakIndexProps> = ({
  behandling,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <RammevedtakFaktaForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

export default FaktaRammevedtakIndex;
