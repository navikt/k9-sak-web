import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import Panel from 'nav-frontend-paneler';
import PropTypes from 'prop-types';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import styles from './søknadsopplysninger.less';
import Søknadsopplysninger from './Søknadsopplysninger';
import Beregningsresultat from './Beregningsresultat';
import Inntektsopplysninger from './Inntektsopplysninger';
import Grenseverdi from './Grenseverdi';

const erDagsatsBeregnet = bg => bg.beregningsgrunnlagPeriode.some(p => p.dagsats || p.dagsats === 0);

const Frisinnpanel = ({ beregningsgrunnlag, behandlingÅrsaker }) => {
  return (
    <>
      <div className={styles.aksjonspunktBehandlerContainer}>
        <Panel>
          <Undertittel>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.Tittel" />
          </Undertittel>
          <VerticalSpacer sixteenPx />
          <Søknadsopplysninger beregningsgrunnlag={beregningsgrunnlag} />
          <VerticalSpacer sixteenPx />
          <Inntektsopplysninger beregningsgrunnlag={beregningsgrunnlag} />
          <VerticalSpacer sixteenPx />
          {erDagsatsBeregnet(beregningsgrunnlag) && (
            <>
              <Grenseverdi beregningsgrunnlag={beregningsgrunnlag} behandlingÅrsaker={behandlingÅrsaker} />
              <VerticalSpacer sixteenPx />
              <Beregningsresultat beregningsgrunnlag={beregningsgrunnlag} behandlingÅrsaker={behandlingÅrsaker} />
            </>
          )}
        </Panel>
      </div>
    </>
  );
};
Frisinnpanel.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
  behandlingÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

Frisinnpanel.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Frisinnpanel;
