import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { ArbeidsgiverOpplysningerPerId, Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import StandardFaktaProps from '@k9-sak-web/fakta-felles/standardFaktaPropsTsType';
import ArbeidsforholdInfoPanel from './components/ArbeidsforholdInfoPanel';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  arbeidsforhold: ArbeidsforholdV2[];
}

const ArbeidsforholdFaktaIndex = ({
  behandling,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  harApneAksjonspunkter,
  submitCallback,
  readOnly,
}: OwnProps & StandardFaktaProps) => (
  <RawIntlProvider value={intl}>
    {arbeidsforhold && arbeidsgiverOpplysningerPerId && (
      <ArbeidsforholdInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        aksjonspunkter={aksjonspunkter}
        hasOpenAksjonspunkter={harApneAksjonspunkter}
        submitCallback={submitCallback}
        readOnly={readOnly}
      />
    )}
  </RawIntlProvider>
);

export default ArbeidsforholdFaktaIndex;
