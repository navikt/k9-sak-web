import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { Element } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { CheckboxField } from '@fpsak-frontend/form';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';

import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';

import PropTypes from 'prop-types';
import { getFormValuesForBeregning } from '../BeregningFormUtils';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';

import styles from './InntektstabellPanel.less';

export const MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD = 'manuellOverstyringRapportertInntekt';

const { OVERSTYRING_AV_BEREGNINGSGRUNNLAG, AVKLAR_AKTIVITETER } = avklaringsbehovCodes;

/**
 * Inntektstabell
 *
 *
 */
export const InntektstabellPanelImpl = ({
  tabell,
  hjelpeTekstId,
  children,
  skalViseTabell,
  kanOverstyre,
  readOnly,
  avklaringsbehov,
  erOverstyrt,
  fieldArrayID,
}) => (
  <>
    {children}
    <div className={styles.fadeinTabell}>
      <VerticalSpacer sixteenPx />
      {(kanOverstyre || erOverstyrt) && (
        <div className={styles.rightAligned}>
          <CheckboxField
            key="manuellOverstyring"
            name={`${fieldArrayID}.${MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD}`}
            label={{ id: 'VurderFaktaBeregning.ManuellOverstyring' }}
            readOnly={harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, avklaringsbehov) || readOnly}
          />
        </div>
      )}
      {skalViseTabell && (
        <>
          {hjelpeTekstId && (
            <Element>
              <FormattedMessage id={hjelpeTekstId} />
            </Element>
          )}
          {tabell}
        </>
      )}
    </div>
  </>
);

InntektstabellPanelImpl.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  tabell: PropTypes.node.isRequired,
  hjelpeTekstId: PropTypes.string,
  skalViseTabell: PropTypes.bool,
  kanOverstyre: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

InntektstabellPanelImpl.buildInitialValues = avklaringsbehov => ({
  [MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD]: harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, avklaringsbehov),
});

InntektstabellPanelImpl.defaultProps = {
  hjelpeTekstId: undefined,
  skalViseTabell: true,
};

const getSkalKunneOverstyre = createSelector(
  [ownProps => ownProps.erOverstyrer, ownProps => ownProps.avklaringsbehov],
  (erOverstyrer, avklaringsbehov) =>
    erOverstyrer &&
    !avklaringsbehov.some(ab => ab.definisjon === AVKLAR_AKTIVITETER && isAvklaringsbehovOpen(ab.status)),
);

const mapStateToProps = (state, ownProps) => ({
  erOverstyrt: getFormValuesForBeregning(state, ownProps)[MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD],
  kanOverstyre: getSkalKunneOverstyre(ownProps),
});

export default connect(mapStateToProps)(InntektstabellPanelImpl);
