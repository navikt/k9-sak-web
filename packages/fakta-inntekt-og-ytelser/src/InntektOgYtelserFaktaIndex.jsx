import PropTypes from 'prop-types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import InntektOgYtelserPanel from './components/InntektOgYtelserFaktaPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const InntektOgYtelserFaktaIndex = ({ inntektOgYtelser }) => {
  return (
    <RawIntlProvider value={intl}>
      <InntektOgYtelserPanel inntekter={inntektOgYtelser.inntekt} />
    </RawIntlProvider>
  );
};

InntektOgYtelserFaktaIndex.propTypes = {
  inntektOgYtelser: PropTypes.shape().isRequired,
};

export default InntektOgYtelserFaktaIndex;
