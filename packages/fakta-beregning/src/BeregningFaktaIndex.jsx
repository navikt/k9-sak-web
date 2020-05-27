import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { TabsPure } from 'nav-frontend-tabs';
import BeregningInfoPanel from './components/BeregningInfoPanel';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import beregningAksjonspunkterPropType from './propTypes/beregningAksjonspunkterPropType';
import beregningBehandlingPropType from './propTypes/beregningBehandlingPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const BeregningFaktaIndex = ({
  behandling,
  beregningsgrunnlag,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
  submittable,
  erOverstyrer,
}) => {
  const harFlereBeregningsgrunnlag = Array.isArray(beregningsgrunnlag);
  const skalBrukeTabs = harFlereBeregningsgrunnlag && beregningsgrunnlag.length > 1;
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const aktivtBeregningsrunnlag = harFlereBeregningsgrunnlag
    ? beregningsgrunnlag[aktivtBeregningsgrunnlagIndeks]
    : beregningsgrunnlag;
  return (
    <RawIntlProvider value={intl}>
      {skalBrukeTabs && (
        <TabsPure
          tabs={beregningsgrunnlag.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
            aktiv: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
            label: `Beregningsgrunnlag ${currentBeregningsgrunnlagIndex + 1}`,
          }))}
          onChange={(e, clickedIndex) => setAktivtBeregningsgrunnlagIndeks(clickedIndex)}
        />
      )}
      <BeregningInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        beregningsgrunnlag={aktivtBeregningsrunnlag}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        readOnly={readOnly}
        hasOpenAksjonspunkter={harApneAksjonspunkter}
        submittable={submittable}
        erOverstyrer={erOverstyrer}
      />
    </RawIntlProvider>
  );
};

BeregningFaktaIndex.propTypes = {
  behandling: beregningBehandlingPropType.isRequired,
  beregningsgrunnlag: PropTypes.oneOfType([beregningsgrunnlagPropType, PropTypes.arrayOf(beregningsgrunnlagPropType)]),
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
};

BeregningFaktaIndex.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningFaktaIndex;
