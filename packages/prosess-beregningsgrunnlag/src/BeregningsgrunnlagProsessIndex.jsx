import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import beregningsgrunnlagBehandlingPropType from './propTypes/beregningsgrunnlagBehandlingPropType';
import beregningsgrunnlagAksjonspunkterPropType from './propTypes/beregningsgrunnlagAksjonspunkterPropType';
import BeregningFP2 from './components/BeregningFP';

import messages from '../i18n/nb_NO.json';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import { BeregningContext } from './beregningContext';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const BeregningsgrunnlagProsessIndex = ({
  behandling,
  beregningsgrunnlag,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  isAksjonspunktOpen,
  vilkar,
  alleKodeverk,
  arbeidsgiverOpplysninger,
  fagsak,
}) => (
  <RawIntlProvider value={intl}>
    <BeregningContext.Provider value={{ fagsakYtelseType: fagsak?.fagsakYtelseType }}>
      <BeregningFP2
        behandling={behandling}
        beregningsgrunnlag={beregningsgrunnlag}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        readOnly={isReadOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        apCodes={aksjonspunkter.map(a => a.definisjon.kode)}
        isApOpen={isAksjonspunktOpen}
        vilkar={vilkar}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger ? arbeidsgiverOpplysninger.arbeidsgivere : {}}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
      />
    </BeregningContext.Provider>
  </RawIntlProvider>
);

BeregningsgrunnlagProsessIndex.propTypes = {
  behandling: beregningsgrunnlagBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  beregningsgrunnlag: PropTypes.oneOfType([beregningsgrunnlagPropType, PropTypes.arrayOf(beregningsgrunnlagPropType)]),
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysninger: PropTypes.shape().isRequired,
  fagsak: PropTypes.shape().isRequired,
};

BeregningsgrunnlagProsessIndex.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningsgrunnlagProsessIndex;
