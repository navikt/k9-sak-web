import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TabsPure } from 'nav-frontend-tabs';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import VurderFaktaBeregningPanel from './components/fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import beregningAksjonspunkterPropType from './propTypes/beregningAksjonspunkterPropType';
import beregningBehandlingPropType from './propTypes/beregningBehandlingPropType';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import AvklareAktiviteterPanel from './components/avklareAktiviteter/AvklareAktiviteterPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;

const BeregningFaktaIndex = ({
  behandling,
  beregningsgrunnlag,
  alleKodeverk,
  aksjonspunkter,
  submitCallback,
  readOnly,
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
      <div style={{ paddingTop: skalBrukeTabs ? '16px' : '' }}>
        <AvklareAktiviteterPanel
          readOnly={
            readOnly || (hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter) && !erOverstyrer)
          }
          harAndreAksjonspunkterIPanel={hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)}
          submitCallback={submitCallback}
          submittable={submittable}
          erOverstyrer={erOverstyrer}
          aksjonspunkter={aksjonspunkter}
          alleKodeverk={alleKodeverk}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          beregningsgrunnlag={aktivtBeregningsrunnlag}
          aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndeks}
          alleBeregningsgrunnlag={harFlereBeregningsgrunnlag ? beregningsgrunnlag : [aktivtBeregningsrunnlag]}
        />
        <VerticalSpacer thirtyTwoPx />
        <VurderFaktaBeregningPanel
          readOnly={readOnly || (hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter) && !erOverstyrer)}
          submitCallback={submitCallback}
          submittable={submittable}
          aksjonspunkter={aksjonspunkter}
          alleKodeverk={alleKodeverk}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          beregningsgrunnlag={aktivtBeregningsrunnlag}
          behandlingResultatPerioder={behandling?.behandlingsresultat?.vilkårResultat.BEREGNINGSGRUNNLAGVILKÅR}
          erOverstyrer={erOverstyrer}
          alleBeregningsgrunnlag={harFlereBeregningsgrunnlag ? beregningsgrunnlag : [beregningsgrunnlag]}
          aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndeks}
        />
      </div>
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
  submittable: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
};

BeregningFaktaIndex.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningFaktaIndex;
