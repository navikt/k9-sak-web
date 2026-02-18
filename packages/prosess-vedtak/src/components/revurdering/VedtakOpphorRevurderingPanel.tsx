import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { BodyShort, Label } from '@navikt/ds-react';
import moment from 'moment';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { VedtakVarsel } from '../../types/VedtakVarsel';

const ytelseNavnMap = kode => {
  switch (kode) {
    case fagsakYtelsesType.FRISINN:
      return 'Frilans og selvstendig næringsdrivende inntektskompensasjon';
    case fagsakYtelsesType.OMSORGSPENGER:
      return 'Omsorgspenger';
    case fagsakYtelsesType.PLEIEPENGER_SYKT_BARN:
      return 'Pleiepenger';
    default:
      return 'Ytelsen';
  }
};

interface VedtakOpphorRevurderingPanelProps {
  ytelseTypeKode: string;
  medlemskapFom: string;
  vedtakVarsel: VedtakVarsel;
}

interface OwnState {
  opphoersdato?: string;
}

export const VedtakOpphorRevurderingPanelImpl = ({
  intl,
  opphoersdato = '',
  ytelseTypeKode,
}: VedtakOpphorRevurderingPanelProps & OwnState & WrappedComponentProps) => (
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

const getOpphorsdato = createSelector(
  [ownProps => ownProps.medlemskapFom, ownProps => ownProps.vedtakVarsel],
  (medlemskapFom, vedtakVarsel) => {
    if (medlemskapFom) {
      return medlemskapFom;
    }
    return vedtakVarsel.skjæringstidspunkt ? vedtakVarsel.skjæringstidspunkt.dato : '';
  },
);

const mapStateToProps = (state, ownProps: VedtakOpphorRevurderingPanelProps) => ({
  opphoersdato: getOpphorsdato(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakOpphorRevurderingPanelImpl));
