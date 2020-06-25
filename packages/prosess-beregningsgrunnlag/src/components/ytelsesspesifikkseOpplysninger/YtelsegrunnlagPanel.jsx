import React from 'react';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import Frisinnpanel from './frisinn/Frisinnpanel';
import beregningsgrunnlagBehandlingPropType from '../../propTypes/beregningsgrunnlagBehandlingPropType';

const lagFrisinnpaneler = (beregningsgrunnlag, behandling) => {
  return <Frisinnpanel beregningsgrunnlag={beregningsgrunnlag} behandling={behandling} />;
};

/**
 * YtelsegrunnlagPanel
 *
 * Presentasjonskomponent. Holder på ytelsesspesifikke visninger.
 */
export const YtelsegrunnlagPanel = ({ beregningsgrunnlag, behandling }) => {
  const ytelsegrunnlag = beregningsgrunnlag.ytelsesspesifiktGrunnlag;
  if (!ytelsegrunnlag) {
    return null;
  }
  const ytelse = ytelsegrunnlag.ytelsetype;
  if (ytelse === fagsakYtelseType.FRISINN) {
    return lagFrisinnpaneler(beregningsgrunnlag, behandling);
  }
  return null;
};

YtelsegrunnlagPanel.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
  behandling: beregningsgrunnlagBehandlingPropType,
};

YtelsegrunnlagPanel.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default YtelsegrunnlagPanel;
