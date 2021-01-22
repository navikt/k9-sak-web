import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { arbeidsforholdV2PropType } from '@fpsak-frontend/prop-types/src/arbeidsforholdPropType';
import ArbeidsforholdInfoPanel from './components/ArbeidsforholdInfoPanel';
import ArbeidsforholdInfoPanelV2 from './components/ArbeidsforholdInfoPanelV2';
import arbeidsforholdAksjonspunkterPropType from './propTypes/arbeidsforholdAksjonspunkterPropType';
import arbeidsforholdBehandlingPropType from './propTypes/arbeidsforholdBehandlingPropType';
import messages from '../i18n/nb_NO.json';
import arbeidsforholdInntektArbeidYtelsePropType from './propTypes/arbeidsforholdInntektArbeidYtelsePropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const ArbeidsforholdFaktaIndex = ({
  behandling,
  inntektArbeidYtelse,
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
    {inntektArbeidYtelse && (
      <ArbeidsforholdInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        arbeidsforhold={inntektArbeidYtelse.arbeidsforhold}
        skalKunneLeggeTilNyeArbeidsforhold={inntektArbeidYtelse.skalKunneLeggeTilNyeArbeidsforhold}
        skalKunneLageArbeidsforholdBasertPaInntektsmelding={
          inntektArbeidYtelse.skalKunneLageArbeidsforholdBasertPaInntektsmelding
        }
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        aksjonspunkter={aksjonspunkter}
        hasOpenAksjonspunkter={harApneAksjonspunkter}
        submitCallback={submitCallback}
        readOnly={readOnly}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />
    )}
    {arbeidsforhold && arbeidsgiverOpplysningerPerId && (
      <ArbeidsforholdInfoPanelV2
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

ArbeidsforholdFaktaIndex.propTypes = {
  behandling: arbeidsforholdBehandlingPropType.isRequired,
  inntektArbeidYtelse: arbeidsforholdInntektArbeidYtelsePropType.isRequired,
  arbeidsforhold: PropTypes.arrayOf(arbeidsforholdV2PropType),
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(arbeidsforholdAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
};

export default ArbeidsforholdFaktaIndex;
