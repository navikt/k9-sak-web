import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import InntektOgYtelserPanel from './components/InntektOgYtelserFaktaPanel';
import { Inntekt } from './InntektType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface InntektOgYtelserFaktaIndexProps {
  inntektOgYtelser?: { inntekt: Inntekt[] };
}

const InntektOgYtelserFaktaIndex: React.FC<InntektOgYtelserFaktaIndexProps> = ({ inntektOgYtelser }) => (
  <RawIntlProvider value={intl}>
    <InntektOgYtelserPanel inntekter={inntektOgYtelser?.inntekt} />
  </RawIntlProvider>
);

export default InntektOgYtelserFaktaIndex;
