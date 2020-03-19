import { Personopplysninger, Aksjonspunkt, Behandling, SubmitCallback, OmsorgenFor } from '@k9-sak-web/types';
import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import OmsorgenForInfoPanel from './components/OmsorgenForInfoPanel';

interface OmsorgenForFaktaIndexProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  personopplysninger: Personopplysninger;
  omsorgenFor: OmsorgenFor;
  submitCallback: (props: SubmitCallback[]) => void;
  harApneAksjonspunkter: boolean;
  submittable: boolean;
}

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const OmsorgenForFaktaIndex: FunctionComponent<OmsorgenForFaktaIndexProps> = ({
  behandling,
  aksjonspunkter,
  readOnly,
  personopplysninger,
  omsorgenFor,
  submitCallback,
  harApneAksjonspunkter,
  submittable,
}) => (
  <RawIntlProvider value={intl}>
    <OmsorgenForInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      aksjonspunkter={aksjonspunkter}
      readOnly={readOnly}
      personopplysninger={personopplysninger}
      omsorgenFor={omsorgenFor}
      submitCallback={submitCallback}
      harApneAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
    />
  </RawIntlProvider>
);

export default OmsorgenForFaktaIndex;
