import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { findTilbakekrevingText } from '../VedtakHelper';

interface PeriodeMedÅrsak {
  avslagsårsak: string;
  fom: string;
  tom: string;
}

const mapFraAvslagskodeTilTekst = (kode: string) => {
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

export const lagKonsekvensForYtelsenTekst = (konsekvenser: Kodeverk[], getKodeverknavn) => {
  if (!konsekvenser || konsekvenser.length < 1) {
    return '';
  }
  return konsekvenser.map(k => getKodeverknavn(k)).join(' og ');
};

const lagPeriodevisning = (periodeMedÅrsak: PeriodeMedÅrsak) => {
  if (!periodeMedÅrsak) {
    return undefined;
  }
  const fom = moment(periodeMedÅrsak.fom).format(DDMMYYYY_DATE_FORMAT);
  const tom = moment(periodeMedÅrsak.tom).format(DDMMYYYY_DATE_FORMAT);
  const årsak = mapFraAvslagskodeTilTekst(periodeMedÅrsak.avslagsårsak);
  return <FormattedMessage id="VedtakForm.Avslagsgrunner.Beregning" values={{ fom, tom, årsak }} />;
};

interface VedtakInnvilgetRevurderingPanelImplProps {
  intl: IntlShape;
  ytelseTypeKode: string;
  konsekvenserForYtelsen?: Kodeverk[];
  tilbakekrevingText?: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  bgPeriodeMedAvslagsårsak?: PeriodeMedÅrsak;
}

export const VedtakInnvilgetRevurderingPanelImpl = ({
  intl,
  ytelseTypeKode,
  konsekvenserForYtelsen,
  tilbakekrevingText,
  alleKodeverk,
  bgPeriodeMedAvslagsårsak,
}: VedtakInnvilgetRevurderingPanelImplProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
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
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn)}
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn) !== '' && tilbakekrevingText && '. '}
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

VedtakInnvilgetRevurderingPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  konsekvenserForYtelsen: ownProps.behandlingsresultat !== undefined ? [ownProps.behandlingsresultat.type] : undefined,
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetRevurderingPanelImpl));
