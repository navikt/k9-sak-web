import * as React from 'react';
import { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Behandling } from '@k9-sak-web/types';
import messages from '../i18n/nb_NO.json';
import OmsorgenForFaktaForm from './components/OmsorgenForFaktaForm';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OmsorgenForFaktaIndexProps {
  behandling: Behandling;
  submitCallback: VoidFunction;
  readOnly?: boolean;
}

const OmsorgenForFaktaIndex: FunctionComponent<OmsorgenForFaktaIndexProps> = ({
  behandling,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <OmsorgenForFaktaForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

export default OmsorgenForFaktaIndex;
