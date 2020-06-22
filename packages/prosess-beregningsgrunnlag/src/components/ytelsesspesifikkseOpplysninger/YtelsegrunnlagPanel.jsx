import React from 'react';
import PropTypes from 'prop-types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import Frisinnpanel from './frisinn/Frisinnpanel';

const lagFrisinnpaneler = (beregningsgrunnlag, behandlingÅrsaker) => {
  return <Frisinnpanel beregningsgrunnlag={beregningsgrunnlag} behandlingÅrsaker={behandlingÅrsaker} />;
};

/**
 * YtelsegrunnlagPanel
 *
 * Presentasjonskomponent. Holder på ytelsesspesifikke visninger.
 */
export const YtelsegrunnlagPanel = ({ beregningsgrunnlag, behandlingÅrsaker }) => {
  const ytelsegrunnlag = beregningsgrunnlag.ytelsesspesifiktGrunnlag;
  if (!ytelsegrunnlag) {
    return null;
  }
  const ytelse = ytelsegrunnlag.ytelsetype;
  if (ytelse === fagsakYtelseType.FRISINN) {
    return lagFrisinnpaneler(beregningsgrunnlag, behandlingÅrsaker);
  }
  return null;
};
YtelsegrunnlagPanel.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
  behandlingÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

YtelsegrunnlagPanel.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default YtelsegrunnlagPanel;
