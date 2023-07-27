import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { KodeverkMedNavn, Vilkar } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import vedtakResultType from '../../kodeverk/vedtakResultType';
import VedtakOriginalBehandlingType from '../../types/VedtakOriginalBehandlingType';
import AvslagsårsakListe from '../AvslagsårsakListe';
import { findAvslagResultatText, findTilbakekrevingText } from '../VedtakHelper';

interface VedtakAvslagRevurderingPanelImplProps {
  intl: IntlShape;
  beregningResultat?: VedtakOriginalBehandlingType;
  vilkar: Vilkar[];
  originaltBeregningResultat?: VedtakOriginalBehandlingType;
  tilbakekrevingText?: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  ytelseTypeKode: string;
}

export const isNewBehandlingResult = (
  beregningResultat: VedtakOriginalBehandlingType,
  originaltBeregningResultat: VedtakOriginalBehandlingType,
) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

export const isNewAmount = (
  beregningResultat: VedtakOriginalBehandlingType,
  originaltBeregningResultat: VedtakOriginalBehandlingType,
) => {
  if (typeof beregningResultat === 'undefined' || beregningResultat === null) {
    return false;
  }
  return beregningResultat.antallBarn !== originaltBeregningResultat.antallBarn;
};

const resultText = (
  beregningResultat: VedtakOriginalBehandlingType,
  originaltBeregningResultat: VedtakOriginalBehandlingType,
) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat)
    ? 'VedtakForm.Resultat.EndretAntallBarn'
    : 'VedtakForm.Resultat.IngenEndring';
};

export const VedtakAvslagRevurderingPanelImpl = ({
  intl,
  vilkar,
  beregningResultat,
  ytelseTypeKode,
  tilbakekrevingText,
  originaltBeregningResultat,
  alleKodeverk,
}: VedtakAvslagRevurderingPanelImplProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <div>
      <Label size="small" as="p">
        {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
      </Label>
      {(ytelseTypeKode === fagsakYtelseType.FRISINN || ytelseTypeKode === fagsakYtelseType.OMSORGSPENGER) && (
        <BodyShort size="small">
          {intl.formatMessage({ id: findAvslagResultatText(undefined, ytelseTypeKode) })}
          {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
        </BodyShort>
      )}
      {ytelseTypeKode !== fagsakYtelseType.FRISINN && ytelseTypeKode !== fagsakYtelseType.OMSORGSPENGER && (
        <BodyShort size="small">
          {intl.formatMessage({ id: resultText(beregningResultat, originaltBeregningResultat) })}
          {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
        </BodyShort>
      )}
      <div>
        <VerticalSpacer sixteenPx />
        <Label size="small" as="p">
          {intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}
        </Label>
        <AvslagsårsakListe vilkar={vilkar} getKodeverknavn={getKodeverknavn} />
        <VerticalSpacer sixteenPx />
      </div>
      <VerticalSpacer sixteenPx />
    </div>
  );
};

VedtakAvslagRevurderingPanelImpl.defaultProps = {
  originaltBeregningResultat: undefined,
  beregningResultat: undefined,
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagRevurderingPanelImpl));
