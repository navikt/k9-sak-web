import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import beregningsgrunnlagBehandlingPropType from './propTypes/beregningsgrunnlagBehandlingPropType';
import beregningsgrunnlagAksjonspunkterPropType from './propTypes/beregningsgrunnlagAksjonspunkterPropType';
import BeregningFP2 from './components/BeregningFP';

import messages from '../i18n/nb_NO.json';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import { BeregningContext } from './beregningContext';
import beregningKoblingPropType from "./propTypes/beregningKoblingPropType";

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const BeregningsgrunnlagProsessIndex = (
  {
    behandling,
    beregningsgrunnlag,
    submitCallback,
    isReadOnly,
    readOnlySubmitButton,
    vilkar,
    alleKodeverk,
    arbeidsgiverOpplysningerPerId,
    fagsak,
    beregningErBehandlet,
    beregningreferanserTilVurdering,
  }
) => (
  <RawIntlProvider value={intl}>
    <BeregningContext.Provider value={{fagsakYtelseType: fagsak?.fagsakYtelseType}}>
      <BeregningFP2
        behandling={behandling}
        beregningsgrunnlag={beregningsgrunnlag}
        submitCallback={submitCallback}
        readOnly={isReadOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        vilkar={vilkar}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        beregningErBehandlet={beregningErBehandlet}
        beregningreferanserTilVurdering={beregningreferanserTilVurdering}
      />
    </BeregningContext.Provider>
  </RawIntlProvider>
);

BeregningsgrunnlagProsessIndex.propTypes = {
  behandling: beregningsgrunnlagBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  beregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType),
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  fagsak: PropTypes.shape().isRequired,
  beregningErBehandlet: PropTypes.bool,
  beregningreferanserTilVurdering: PropTypes.arrayOf(PropTypes.shape(beregningKoblingPropType)).isRequired,
};

BeregningsgrunnlagProsessIndex.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningsgrunnlagProsessIndex;
