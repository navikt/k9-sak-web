import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import BeregningsresultatPeriode from './BeregningsresultatPeriode';

const finnInntektstak = bg => (bg.grunnbeløp ? bg.grunnbeløp * 6 : null);

const Beregningsresultat = ({ beregningsgrunnlag }) => {
  const grenseverdi = finnInntektstak(beregningsgrunnlag);
  if (!grenseverdi) {
    return null;
  }

  return (
    <div>
      <Row>
        <Column xs="12">
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.Resultat" />
          </Element>
        </Column>
      </Row>
      {beregningsgrunnlag.beregningsgrunnlagPeriode.map(periode => (
        <BeregningsresultatPeriode
          bgperiode={periode}
          ytelsegrunnlag={beregningsgrunnlag.ytelsesspesifiktGrunnlag}
          grenseverdi={grenseverdi}
        />
      ))}
    </div>
  );
};
Beregningsresultat.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

export default Beregningsresultat;
