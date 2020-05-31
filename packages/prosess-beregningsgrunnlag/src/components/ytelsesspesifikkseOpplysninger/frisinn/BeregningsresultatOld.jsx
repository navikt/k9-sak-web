import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import BeregningsresultatPeriodeOld from './BeregningsresultatPeriodeOld';

const finnInntektstak = bg => (bg.grunnbeløp ? bg.grunnbeløp * 6 : null);

const erSøktStatus = (bg, status) => {
  const { perioderSøktFor } = bg.ytelsesspesifiktGrunnlag;
  return perioderSøktFor ? perioderSøktFor.some(p => p.statusSøktFor.kode === status) : false;
};

const finnSamletBruttoForStatus = (andeler, status) => {
  if (!andeler) {
    return 0;
  }
  return andeler
    .filter(a => a.aktivitetStatus.kode === status)
    .map(({ bruttoPrAar }) => bruttoPrAar)
    .reduce((sum, brutto) => sum + brutto, 0);
};

const finnBGFrilans = bg => {
  if (!erSøktStatus(bg, aktivitetStatus.FRILANSER)) {
    return null;
  }
  let inntektstak = finnInntektstak(bg);
  const andelerFørstePeriode = bg.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel;
  const atBrutto = finnSamletBruttoForStatus(andelerFørstePeriode, aktivitetStatus.ARBEIDSTAKER);
  inntektstak -= atBrutto;
  if (!erSøktStatus(bg, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)) {
    const snBrutto = finnSamletBruttoForStatus(andelerFørstePeriode, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
    inntektstak -= snBrutto;
  }
  const frilansBrutto = finnSamletBruttoForStatus(andelerFørstePeriode, aktivitetStatus.FRILANSER);
  return frilansBrutto > inntektstak ? inntektstak : frilansBrutto;
};

const finnBGNæring = bg => {
  if (!erSøktStatus(bg, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)) {
    return null;
  }
  let inntektstak = finnInntektstak(bg);
  const andelerFørstePeriode = bg.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel;
  const atBrutto = finnSamletBruttoForStatus(andelerFørstePeriode, aktivitetStatus.ARBEIDSTAKER);
  inntektstak -= atBrutto;
  const flBrutto = finnSamletBruttoForStatus(andelerFørstePeriode, aktivitetStatus.FRILANSER);
  inntektstak -= flBrutto;
  const snBrutto = finnSamletBruttoForStatus(andelerFørstePeriode, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
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
          <BeregningsresultatPeriodeOld
            bgperiode={periode}
            ytelsegrunnlag={beregningsgrunnlag.ytelsesspesifiktGrunnlag}
            frilansGrunnlag={finnBGFrilans(beregningsgrunnlag)}
            næringGrunnlag={finnBGNæring(beregningsgrunnlag)}
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
