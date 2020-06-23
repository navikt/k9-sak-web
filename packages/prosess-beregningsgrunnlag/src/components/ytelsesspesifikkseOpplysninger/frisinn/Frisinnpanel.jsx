import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import Panel from 'nav-frontend-paneler';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import styles from './søknadsopplysninger.less';
import Søknadsopplysninger from './Søknadsopplysninger';
import Beregningsresultat from './Beregningsresultat';
import Inntektsopplysninger from './Inntektsopplysninger';
import Grenseverdi from './Grenseverdi';

const erDagsatsBeregnet = bg => bg.beregningsgrunnlagPeriode.some(p => p.dagsats || p.dagsats === 0);

const Frisinnpanel = ({ beregningsgrunnlag }) => {
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
              <Grenseverdi beregningsgrunnlag={beregningsgrunnlag} />
              <VerticalSpacer sixteenPx />
              <Beregningsresultat beregningsgrunnlag={beregningsgrunnlag} />
            </>
          )}
        </Panel>
      </div>
    </>
  );
};
Frisinnpanel.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Frisinnpanel.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Frisinnpanel;
