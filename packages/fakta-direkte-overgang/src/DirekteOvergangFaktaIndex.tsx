import type { Aksjonspunkt } from '@k9-sak-web/types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import ManglerSøknadForm from './components/ManglerSøknadForm';

const intlCache = createIntlCache();
const intl = createIntl({ locale: 'nb-NO', messages }, intlCache);

interface Props {
  submitCallback: () => void;
  readOnly: boolean;
  submittable: boolean;
  aksjonspunkter: Aksjonspunkt[];
}

/**
 * DirekteOvergangFaktaIndex
 */
const DirekteOvergangFaktaIndex = ({ submitCallback, readOnly, submittable, aksjonspunkter }: Props) => (
  <RawIntlProvider value={intl}>
    <ManglerSøknadForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      submittable={submittable}
      aksjonspunkter={aksjonspunkter}
    />
  </RawIntlProvider>
);

export default DirekteOvergangFaktaIndex;
