import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import Søknadsopplysninger from './frisinn/Søknadsopplysninger';
import Beregningsresultat from './frisinn/Beregningsresultat';
import Inntektsopplysninger from './frisinn/Inntektsopplysninger';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import styles from './frisinn/søknadsopplysninger.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag.less';

const lagFrisinnpaneler = (beregningsgrunnlag, readOnly) => {
  return (
    <>
      <div className={styles.aksjonspunktBehandlerContainer}>
        <Panel className={readOnly ? beregningStyles.panelRight : styles.aksjonspunktBehandlerBorder}>
          <Undertittel>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.Tittel" />
          </Undertittel>
          <VerticalSpacer sixteenPx />
          <Søknadsopplysninger beregningsgrunnlag={beregningsgrunnlag} />
          <VerticalSpacer sixteenPx />
          <Inntektsopplysninger beregningsgrunnlag={beregningsgrunnlag} />
          <VerticalSpacer sixteenPx />
          <Beregningsresultat beregningsgrunnlag={beregningsgrunnlag} />
        </Panel>
      </div>
    </>
  );
};

/**
 * MilitaerPanel
 *
 * Presentasjonskomponent. Viser beregningsgrunnlag for militær og sivilforsvarstjeneste.
 */
export const YtelsegrunnlagPanel = ({ readOnly, beregningsgrunnlag }) => {
  const ytelsegrunnlag = beregningsgrunnlag.ytelsesspesifiktGrunnlag;
  if (!ytelsegrunnlag) {
    return null;
  }
  const ytelse = ytelsegrunnlag.ytelsetype;
  if (ytelse === 'FRISINN') {
    return lagFrisinnpaneler(beregningsgrunnlag, readOnly);
  }
  return null;
};

YtelsegrunnlagPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

YtelsegrunnlagPanel.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default YtelsegrunnlagPanel;
