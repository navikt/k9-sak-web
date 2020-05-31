import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import BeregningsresultatPeriode from './BeregningsresultatPeriode';
import { erSøktForAndel, finnVisningForStatusIPeriode } from './FrisinnUtils';

const finnInntektstak = bg => (bg.grunnbeløp ? bg.grunnbeløp * 6 : null);

const finnBGFrilans = (bg, periode) => {
  if (!erSøktForAndel(aktivitetStatus.FRILANSER, bg.ytelsesspesifiktGrunnlag)) {
    return null;
  }
  let inntektstak = finnInntektstak(bg);
  const atBrutto = finnVisningForStatusIPeriode(aktivitetStatus.ARBEIDSTAKER, bg, periode);
  inntektstak -= atBrutto;
  if (!erSøktForAndel(bg, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)) {
    const snBrutto = finnVisningForStatusIPeriode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bg, periode);
    inntektstak -= snBrutto;
  }
  const frilansBrutto = finnVisningForStatusIPeriode(aktivitetStatus.FRILANSER, bg, periode);
  return frilansBrutto > inntektstak ? inntektstak : frilansBrutto;
};

const finnBGNæring = (bg, periode) => {
  if (!erSøktForAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bg.ytelsesspesifiktGrunnlag)) {
    return null;
  }
  let inntektstak = finnInntektstak(bg);
  const atBrutto = finnVisningForStatusIPeriode(aktivitetStatus.ARBEIDSTAKER, bg, periode);
  inntektstak -= atBrutto;
  const flBrutto = finnVisningForStatusIPeriode(aktivitetStatus.FRILANSER, bg, periode);
  inntektstak -= flBrutto;
  const snBrutto = finnVisningForStatusIPeriode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bg, periode);
  return snBrutto > inntektstak ? inntektstak : snBrutto;
};

const Beregningsresultat = ({ beregningsgrunnlag }) => {
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
        <div key={periode.beregningsgrunnlagPeriodeFom}>
          <BeregningsresultatPeriode
            bgperiode={periode}
            ytelsegrunnlag={beregningsgrunnlag.ytelsesspesifiktGrunnlag}
            frilansGrunnlag={finnBGFrilans(beregningsgrunnlag, periode)}
            næringGrunnlag={finnBGNæring(beregningsgrunnlag, periode)}
            key={periode.beregningsgrunnlagperiodeFom}
          />
        </div>
      ))}
    </div>
  );
};
Beregningsresultat.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

export default Beregningsresultat;
