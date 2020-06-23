import React from 'react';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import Frisinnpanel from './frisinn/Frisinnpanel';

const lagFrisinnpaneler = beregningsgrunnlag => {
  return <Frisinnpanel beregningsgrunnlag={beregningsgrunnlag} />;
};

/**
 * YtelsegrunnlagPanel
 *
 * Presentasjonskomponent. Holder på ytelsesspesifikke visninger.
 */
export const YtelsegrunnlagPanel = ({ beregningsgrunnlag }) => {
  const ytelsegrunnlag = beregningsgrunnlag.ytelsesspesifiktGrunnlag;
  if (!ytelsegrunnlag) {
    return null;
  }
  const ytelse = ytelsegrunnlag.ytelsetype;
  if (ytelse === fagsakYtelseType.FRISINN) {
    return lagFrisinnpaneler(beregningsgrunnlag);
  }
  return null;
};

YtelsegrunnlagPanel.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

YtelsegrunnlagPanel.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default YtelsegrunnlagPanel;
