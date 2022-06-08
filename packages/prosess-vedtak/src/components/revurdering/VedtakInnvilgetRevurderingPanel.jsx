import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
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
  ytelseTypeKode,
  konsekvenserForYtelsen,
  tilbakekrevingText,
  alleKodeverk,
  bgPeriodeMedAvslagsårsak,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {(ytelseTypeKode === fagsakYtelseType.OMSORGSPENGER ||
        ytelseTypeKode === fagsakYtelseType.FRISINN ||
        ytelseTypeKode === fagsakYtelseType.PLEIEPENGER) && (
          <div data-testid='innvilgetRevurdering'>
            <Normaltekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Normaltekst>
            <Undertekst>
              {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn)}
              {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn) !== '' && tilbakekrevingText && '. '}
              {tilbakekrevingText &&
                intl.formatMessage({
                  id: tilbakekrevingText,
                })}
              {bgPeriodeMedAvslagsårsak && <Undertekst>{lagPeriodevisning(bgPeriodeMedAvslagsårsak)}</Undertekst>}
            </Undertekst>
            <VerticalSpacer sixteenPx />
          </div>
        )}
    </>
  );
};

VedtakInnvilgetRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  konsekvenserForYtelsen: PropTypes.arrayOf(PropTypes.shape()),
  tilbakekrevingText: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
  bgPeriodeMedAvslagsårsak: PropTypes.shape(),
};

VedtakInnvilgetRevurderingPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  konsekvenserForYtelsen: ownProps.behandlingsresultat !== undefined ? [ownProps.behandlingsresultat.type] : undefined,
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetRevurderingPanelImpl));
