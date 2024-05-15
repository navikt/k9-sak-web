import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
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

/*
 * Denne bruker behandlingsresultat.type som i tidligere kodeverk hadde flere attributer bakt inn. Dette skal skrives bort
 * så type blir en string som andre kodeverk
 */
export const lagKonsekvensForYtelsenTekst = (konsekvenser, kodeverkNavnFraKode) => {
  if (!konsekvenser || konsekvenser.length < 1) {
    return '';
  }
  return konsekvenser.map(k => kodeverkNavnFraKode(k, KodeverkType.KONSEKVENS_FOR_YTELSEN)).join(' og ');
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
  bgPeriodeMedAvslagsårsak,
}) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {(ytelseTypeKode === fagsakYtelseType.OMSORGSPENGER ||
        ytelseTypeKode === fagsakYtelseType.FRISINN ||
        ytelseTypeKode === fagsakYtelseType.PLEIEPENGER) && (
        <div data-testid="innvilgetRevurdering">
          <Label size="small" as="p">
            {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
          </Label>
          <BodyShort size="small">
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, kodeverkNavnFraKode)}
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, kodeverkNavnFraKode) !== '' &&
              tilbakekrevingText &&
              '. '}
            {tilbakekrevingText &&
              intl.formatMessage({
                id: tilbakekrevingText,
              })}
            {bgPeriodeMedAvslagsårsak && (
              <BodyShort size="small">{lagPeriodevisning(bgPeriodeMedAvslagsårsak)}</BodyShort>
            )}
          </BodyShort>
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
  bgPeriodeMedAvslagsårsak: PropTypes.shape(),
};

VedtakInnvilgetRevurderingPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  konsekvenserForYtelsen: ownProps.behandlingsresultat !== undefined ? [ownProps.behandlingsresultat] : undefined,
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetRevurderingPanelImpl));
