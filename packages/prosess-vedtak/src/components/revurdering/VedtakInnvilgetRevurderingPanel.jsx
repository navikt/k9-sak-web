import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { Column, Row } from 'nav-frontend-grid';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyWithKr, getKodeverknavnFn } from '@fpsak-frontend/utils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import vedtakResultType from '../../kodeverk/vedtakResultType';
import { findTilbakekrevingText } from '../VedtakHelper';

const mapFraAvslagskodeTilTekst = kode => {
  switch (kode) {
    case avslagsarsakCodes.AVKORTET_GRUNNET_ANNEN_INNTEKT:
      return 'Avkortet grunnet annen inntekt';
    case avslagsarsakCodes.FOR_LAVT_BG:
      return 'For lavt brutto beregningsgrunnlag';
    case avslagsarsakCodes.AVKORTET_GRUNNET_LØPENDE_INNTEKT:
      return 'Avkortet grunnet løpende inntekter';
    case avslagsarsakCodes.INGEN_FRILANS_I_PERIODE_UTEN_YTELSE:
      return 'Ingen frilansaktivitet i periode uten ytelse';
    default:
      return 'Avslag';
  }
};

const isNewBehandlingResult = (beregningResultat, originaltBeregningResultat) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

const isNewAmount = (beregningResultat, originaltBeregningResultat) => {
  if (beregningResultat === null) {
    return false;
  }
  return beregningResultat.beregnetTilkjentYtelse !== originaltBeregningResultat.beregnetTilkjentYtelse;
};

const resultTextES = (beregningResultat, originaltBeregningResultat) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat)
    ? 'VedtakForm.Resultat.EndretTilkjentYtelse'
    : 'VedtakForm.Resultat.IngenEndring';
};

export const lagKonsekvensForYtelsenTekst = (konsekvenser, getKodeverknavn) => {
  if (!konsekvenser || konsekvenser.length < 1) {
    return '';
  }
  return konsekvenser.map(k => getKodeverknavn(k)).join(' og ');
};

const lagPeriodevisning = periodeMedÅrsak => {
  if (!periodeMedÅrsak) {
    return undefined;
  }
  const fom = moment(periodeMedÅrsak.fom).format(DDMMYYYY_DATE_FORMAT);
  const tom = moment(periodeMedÅrsak.tom).format(DDMMYYYY_DATE_FORMAT);
  const årsak = mapFraAvslagskodeTilTekst(periodeMedÅrsak.avslagsårsak);
  return <FormattedMessage id="VedtakForm.Avslagsgrunner.Beregning" values={{ fom, tom, årsak }} />;
};

export const VedtakInnvilgetRevurderingPanelImpl = ({
  intl,
  antallBarn,
  originaltBeregningResultat,
  beregningResultat,
  ytelseTypeKode,
  konsekvenserForYtelsen,
  revurderingsAarsakString,
  tilbakekrevingText,
  alleKodeverk,
  bgPeriodeMedAvslagsårsak,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
          <Normaltekst>
            {intl.formatMessage({ id: resultTextES(beregningResultat, originaltBeregningResultat) })}
            {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
          </Normaltekst>
          <VerticalSpacer sixteenPx />
          <Row>
            {beregningResultat && (
              <Column xs="4">
                <Undertekst>{intl.formatMessage({ id: 'VedtakForm.beregnetTilkjentYtelse' })}</Undertekst>
                <Element>{formatCurrencyWithKr(beregningResultat.beregnetTilkjentYtelse)}</Element>
              </Column>
            )}
            {antallBarn && (
              <Column xs="8">
                <Undertekst>{intl.formatMessage({ id: 'VedtakForm.AntallBarn' })}</Undertekst>
                <Element>{antallBarn}</Element>
              </Column>
            )}
          </Row>
        </div>
      )}
      {(ytelseTypeKode === fagsakYtelseType.FORELDREPENGER ||
        ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER ||
        ytelseTypeKode === fagsakYtelseType.OMSORGSPENGER ||
        ytelseTypeKode === fagsakYtelseType.FRISINN) && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
          <Normaltekst>
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn)}
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn) !== '' && tilbakekrevingText && '. '}
            {tilbakekrevingText &&
              intl.formatMessage({
                id: tilbakekrevingText,
              })}
            {bgPeriodeMedAvslagsårsak && <Normaltekst>{lagPeriodevisning(bgPeriodeMedAvslagsårsak)}</Normaltekst>}
          </Normaltekst>
          <VerticalSpacer sixteenPx />
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.RevurderingFP.Aarsak' })}</Undertekst>
          {revurderingsAarsakString !== undefined && <Normaltekst>{revurderingsAarsakString}</Normaltekst>}
        </div>
      )}
    </>
  );
};

VedtakInnvilgetRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  antallBarn: PropTypes.number,
  originaltBeregningResultat: PropTypes.shape(),
  beregningResultat: PropTypes.shape(),
  ytelseTypeKode: PropTypes.string.isRequired,
  konsekvenserForYtelsen: PropTypes.arrayOf(PropTypes.shape()),
  revurderingsAarsakString: PropTypes.string,
  tilbakekrevingText: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
  bgPeriodeMedAvslagsårsak: PropTypes.shape(),
};

VedtakInnvilgetRevurderingPanelImpl.defaultProps = {
  antallBarn: undefined,
  beregningResultat: undefined,
  originaltBeregningResultat: undefined,
  konsekvenserForYtelsen: undefined,
  revurderingsAarsakString: undefined,
  tilbakekrevingText: null,
  bgPeriodeMedAvslagsårsak: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  konsekvenserForYtelsen: ownProps.behandlingsresultat !== undefined ? [ownProps.behandlingsresultat.type] : undefined,
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetRevurderingPanelImpl));
