import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import BeregningsresultatPeriode from './BeregningsresultatPeriode';
import {
  erSøktForAndelISøknadsperiode,
  finnBruttoForStatusIPeriode,
  finnFrisinnperioderSomSkalVises,
} from './FrisinnUtils';
import beregningsgrunnlagBehandlingPropType from '../../../propTypes/beregningsgrunnlagBehandlingPropType';

const finnInntektstak = bg => (bg.grunnbeløp ? bg.grunnbeløp * 6 : null);

const finnBGFrilans = (bg, periode) => {
  if (!erSøktForAndelISøknadsperiode(aktivitetStatus.FRILANSER, periode, bg.ytelsesspesifiktGrunnlag)) {
    return null;
  }
  let inntektstak = finnInntektstak(bg);
  const atBrutto = finnBruttoForStatusIPeriode(aktivitetStatus.ARBEIDSTAKER, bg, periode);
  inntektstak -= atBrutto;
  if (
    !erSøktForAndelISøknadsperiode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, periode, bg.ytelsesspesifiktGrunnlag)
  ) {
    const snBrutto = finnBruttoForStatusIPeriode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bg, periode);
    inntektstak -= snBrutto;
  }
  const frilansBrutto = finnBruttoForStatusIPeriode(aktivitetStatus.FRILANSER, bg, periode);
  return frilansBrutto > inntektstak ? inntektstak : frilansBrutto;
};

const finnBGNæring = (bg, periode) => {
  if (
    !erSøktForAndelISøknadsperiode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, periode, bg.ytelsesspesifiktGrunnlag)
  ) {
    return null;
  }
  let inntektstak = finnInntektstak(bg);
  const atBrutto = finnBruttoForStatusIPeriode(aktivitetStatus.ARBEIDSTAKER, bg, periode);
  inntektstak -= atBrutto;
  const flBrutto = finnBruttoForStatusIPeriode(aktivitetStatus.FRILANSER, bg, periode);
  inntektstak -= flBrutto;
  const snBrutto = finnBruttoForStatusIPeriode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bg, periode);
  return snBrutto > inntektstak ? inntektstak : snBrutto;
};

const overlapperMedFrisinnPeriode = (bgPeriode, frisinnPerioder) => {
  const bgFom = moment(bgPeriode.beregningsgrunnlagPeriodeFom);
  const bgTom = moment(bgPeriode.beregningsgrunnlagPeriodeTom);
  return frisinnPerioder.some(p => !moment(p.fom).isBefore(bgFom) && !moment(p.tom).isAfter(bgTom));
};

const Beregningsresultat = ({ beregningsgrunnlag, behandling }) => {
  const frisinnPerioderSomSkalVises = finnFrisinnperioderSomSkalVises(beregningsgrunnlag, behandling);
  const bgPerioderSomSkalVises = beregningsgrunnlag.beregningsgrunnlagPeriode.filter(p =>
    overlapperMedFrisinnPeriode(p, frisinnPerioderSomSkalVises),
  );
  return (
    <div>
      <Row>
        <Column xs="12">
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.Resultat" />
          </Element>
        </Column>
      </Row>
      {bgPerioderSomSkalVises.map(periode => (
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
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  behandling: beregningsgrunnlagBehandlingPropType.isRequired,
};

export default Beregningsresultat;
