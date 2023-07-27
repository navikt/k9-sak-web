import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import moment from 'moment';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const ytelseNavnMap = (kode: string) => {
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

interface VedtakOpphorRevurderingPanelImplProps {
  intl: IntlShape;
  opphoersdato?: string;
  ytelseTypeKode: string;
}

export const VedtakOpphorRevurderingPanelImpl = ({
  intl,
  opphoersdato,
  ytelseTypeKode,
}: VedtakOpphorRevurderingPanelImplProps) => (
  <div data-testid="opphorRevurdering">
    <Label size="small" as="p">
      {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
    </Label>
    {opphoersdato && (
      <BodyShort size="small">
        {intl.formatMessage(
          {
            id: 'VedtakForm.Revurdering.OpphoererDato',
          },
          { ytelse: ytelseNavnMap(ytelseTypeKode), dato: moment(opphoersdato).format(DDMMYYYY_DATE_FORMAT) },
        )}
      </BodyShort>
    )}
    {!opphoersdato && (
      <BodyShort size="small">
        {intl.formatMessage(
          {
            id: 'VedtakForm.Revurdering.Opphoerer',
          },
          { ytelse: ytelseNavnMap(ytelseTypeKode) },
        )}
      </BodyShort>
    )}
    <VerticalSpacer sixteenPx />
  </div>
);

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
