import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';

const finnSamletBruttoForStatus = (andeler, status) => {
  if (!andeler) {
    return 0;
  }
  return andeler
    .filter(a => a.aktivitetStatus.kode === status)
    .map(({ bruttoPrAar }) => bruttoPrAar)
    .reduce((sum, brutto) => sum + brutto, 0);
};

const finnDagsatsForStatus = (andeler, status) => {
  if (!andeler) {
    return 0;
  }
  return andeler
    .filter(a => a.aktivitetStatus.kode === status)
    .map(({ dagsats }) => dagsats)
    .reduce((sum, dagsats) => sum + dagsats, 0);
};

const lagPeriodeHeader = (fom, originalTom) => {
  let tom = null;
  if (originalTom !== '9999-12-31') {
    tom = originalTom;
  }
  return (
    <FormattedMessage
      id="Beregningsgrunnlag.BeregningTable.Periode"
      key={`fom-tom${fom}${tom}`}
      values={{
        fom: moment(fom).format(DDMMYYYY_DATE_FORMAT),
        tom: tom ? moment(tom).format(DDMMYYYY_DATE_FORMAT) : '',
      }}
    />
  );
};

const statuserDetErSøktOmIPerioden = (bgPeriode, ytelsegrunnlag) => {
  const fom = bgPeriode.beregningsgrunnlagPeriodeFom;
  const tom = bgPeriode.beregningsgrunnlagPeriodeTom;
  const perioder = ytelsegrunnlag.perioderSøktFor;
  return perioder
    ? perioder.filter(periode => !moment(fom).isBefore(periode.fom) && !moment(tom).isAfter(periode.tom))
    : [];
};

const lagFrilansBlokk = (bruttoFl, samletATBrutto, løpendeFLInntekt, løpendeSNInntekt, dagsatsFL) => {
  return (
    <>
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektFL" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(bruttoFl)}</Normaltekst>
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Frisinn.SamletAT" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(samletATBrutto)}</Normaltekst>
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Frisinn.SamletFL" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(løpendeFLInntekt)}</Normaltekst>
        </Column>
      </Row>
      {(løpendeSNInntekt || løpendeSNInntekt === 0) && (
        <Row>
          <Column xs="10">
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.SamletSN" />
          </Column>
          <Column xs="2">
            <Normaltekst>{formatCurrencyNoKr(løpendeSNInntekt)}</Normaltekst>
          </Column>
        </Row>
      )}
      <Row>
        <Column xs="12" className={beregningStyles.noPaddingRight}>
          <div className={beregningStyles.colDevider} />
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Resultat.DagsatsFL" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(dagsatsFL)}</Normaltekst>
        </Column>
      </Row>
    </>
  );
};

const lagNæringsblokk = (bruttoSN, samletATBrutto, løpendeFLInntekt, løpendeSNInntekt, dagsatsSN) => {
  return (
    <>
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektSN" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(bruttoSN)}</Normaltekst>
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Frisinn.SamletAT" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(samletATBrutto)}</Normaltekst>
        </Column>
      </Row>
      {(løpendeFLInntekt || løpendeFLInntekt === 0) && (
        <Row>
          <Column xs="10">
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.SamletFL" />
          </Column>
          <Column xs="2">
            <Normaltekst>{formatCurrencyNoKr(løpendeFLInntekt)}</Normaltekst>
          </Column>
        </Row>
      )}
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Frisinn.SamletSN" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(løpendeSNInntekt)}</Normaltekst>
        </Column>
      </Row>
      <Row>
        <Column xs="12" className={beregningStyles.noPaddingRight}>
          <div className={beregningStyles.colDevider} />
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Resultat.DagsatsSN" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(dagsatsSN)}</Normaltekst>
        </Column>
      </Row>
    </>
  );
};

const BeregningsresultatPeriode = ({ bgperiode, ytelsegrunnlag }) => {
  const statuserDetErSøktOm = statuserDetErSøktOmIPerioden(bgperiode, ytelsegrunnlag);
  if (!statuserDetErSøktOm || statuserDetErSøktOm.length < 1) {
    return null;
  }
  // TODO hvordan finne ut at det er søkt ytelse i perioden?
  const søktFLIPeriode = statuserDetErSøktOm.some(periode => periode.statusSøktFor.kode === aktivitetStatus.FRILANSER);
  const søktSNIPeriode = statuserDetErSøktOm.some(
    periode => periode.statusSøktFor.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );

  const løpendeFLInntekt = ytelsegrunnlag.opplysningerFL ? ytelsegrunnlag.opplysningerFL.oppgittÅrsinntekt : undefined;
  const løpendeSNInntekt = ytelsegrunnlag.opplysningerSN ? ytelsegrunnlag.opplysningerSN.oppgittÅrsinntekt : undefined;
  const samletATBrutto = finnSamletBruttoForStatus(
    bgperiode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.ARBEIDSTAKER,
  );
  const samletFLBrutto = finnSamletBruttoForStatus(
    bgperiode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.FRILANSER,
  );
  const samletSNBrutto = finnSamletBruttoForStatus(
    bgperiode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );

  const dagsatsFL = finnDagsatsForStatus(bgperiode.beregningsgrunnlagPrStatusOgAndel, aktivitetStatus.FRILANSER);
  const dagsatsSN = finnDagsatsForStatus(
    bgperiode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  return (
    <div>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="10">
          <Element>
            {lagPeriodeHeader(bgperiode.beregningsgrunnlagPeriodeFom, bgperiode.beregningsgrunnlagPeriodeTom)}
          </Element>
        </Column>
      </Row>
      {søktFLIPeriode && lagFrilansBlokk(samletFLBrutto, samletATBrutto, løpendeFLInntekt, løpendeSNInntekt, dagsatsFL)}
      <VerticalSpacer sixteenPx />
      {søktSNIPeriode && lagNæringsblokk(samletSNBrutto, samletATBrutto, løpendeFLInntekt, løpendeSNInntekt, dagsatsSN)}
    </div>
  );
};
BeregningsresultatPeriode.propTypes = {
  bgperiode: PropTypes.shape().isRequired,
  ytelsegrunnlag: PropTypes.shape().isRequired,
};

export default BeregningsresultatPeriode;
