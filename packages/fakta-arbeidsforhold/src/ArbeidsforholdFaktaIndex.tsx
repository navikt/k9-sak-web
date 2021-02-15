import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { ArbeidsgiverOpplysningerPerId, Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import ArbeidsforholdInfoPanel from './components/ArbeidsforholdInfoPanel';
import messages from '../i18n/nb_NO.json';
import StandardFaktaProps from '../../fakta-felles/standardFaktaPropsTsType';

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

const ArbeidsforholdFaktaIndex: FunctionComponent<OwnProps & StandardFaktaProps> = ({
  behandling,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  harApneAksjonspunkter,
  submitCallback,
  readOnly,
}) => (
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
