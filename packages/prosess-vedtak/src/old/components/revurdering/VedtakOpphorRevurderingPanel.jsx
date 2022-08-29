import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

const ytelseNavnMap = kode => {
  switch (kode) {
    case fagsakYtelseType.FRISINN:
      return 'Frilans og selvstendig næringsdrivende inntektskompensasjon';
    case fagsakYtelseType.OMSORGSPENGER:
      return 'Omsorgspenger';
    case fagsakYtelseType.PLEIEPENGER:
      return 'Pleiepenger';
    default:
      return 'Ytelsen';
  }
};

export const VedtakOpphorRevurderingPanelImpl = ({ intl, opphoersdato, ytelseTypeKode }) => (
  <div data-testid="opphorRevurdering">
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    {opphoersdato && (
      <Normaltekst>
        {intl.formatMessage(
          {
            id: 'VedtakForm.Revurdering.OpphoererDato',
          },
          { ytelse: ytelseNavnMap(ytelseTypeKode), dato: moment(opphoersdato).format(DDMMYYYY_DATE_FORMAT) },
        )}
      </Normaltekst>
    )}
    {!opphoersdato && (
      <Normaltekst>
        {intl.formatMessage(
          {
            id: 'VedtakForm.Revurdering.Opphoerer',
          },
          { ytelse: ytelseNavnMap(ytelseTypeKode) },
        )}
      </Normaltekst>
    )}
    <VerticalSpacer sixteenPx />
  </div>
);

VedtakOpphorRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  opphoersdato: PropTypes.string,
  ytelseTypeKode: PropTypes.string.isRequired,
};

VedtakOpphorRevurderingPanelImpl.defaultProps = {
  opphoersdato: '',
};

const getOpphorsdato = createSelector(
  [ownProps => ownProps.resultatstruktur, ownProps => ownProps.medlemskapFom, ownProps => ownProps.vedtakVarsel],
  (resultatstruktur, medlemskapFom, vedtakVarsel) => {
    if (resultatstruktur && resultatstruktur.opphoersdato) {
      return resultatstruktur.opphoersdato;
    }
    if (medlemskapFom) {
      return medlemskapFom;
    }
    return vedtakVarsel.skjæringstidspunkt ? vedtakVarsel.skjæringstidspunkt.dato : '';
  },
);

const mapStateToProps = (state, ownProps) => ({
  opphoersdato: getOpphorsdato(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakOpphorRevurderingPanelImpl));
