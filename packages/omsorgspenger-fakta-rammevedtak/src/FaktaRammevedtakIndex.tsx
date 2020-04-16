import * as React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '@fpsak-frontend/prosess-uttak/i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const FaktaRammevedtakIndex = () => <RawIntlProvider value={intl}>heiheih</RawIntlProvider>;

export default FaktaRammevedtakIndex;
