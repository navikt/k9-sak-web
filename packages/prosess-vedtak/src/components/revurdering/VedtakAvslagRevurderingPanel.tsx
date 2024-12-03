import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Label } from '@navikt/ds-react';
import { TilbakekrevingValgDto, VilkårMedPerioderDto } from '@navikt/k9-sak-typescript-client';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import vedtakResultType from '../../kodeverk/vedtakResultType';
import { BeregningResultat } from '../../types/BeregningResultat';
import AvslagsårsakListe from '../AvslagsårsakListe';
import { findAvslagResultatText, findTilbakekrevingText } from '../VedtakHelper';

export const isNewBehandlingResult = (
  beregningResultat: BeregningResultat,
  originaltBeregningResultat: BeregningResultat,
) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

export const isNewAmount = (beregningResultat: BeregningResultat, originaltBeregningResultat: BeregningResultat) => {
  if (typeof beregningResultat === 'undefined' || beregningResultat === null) {
    return false;
  }
  return beregningResultat.antallBarn !== originaltBeregningResultat.antallBarn;
};

const resultText = (beregningResultat: BeregningResultat, originaltBeregningResultat: BeregningResultat) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat)
    ? 'VedtakForm.Resultat.EndretAntallBarn'
    : 'VedtakForm.Resultat.IngenEndring';
};

interface VedtakAvslagRevurderingPanelProps {
  vilkar: VilkårMedPerioderDto[];
  beregningResultat: BeregningResultat;
  ytelseTypeKode: string;
  originaltBeregningResultat: BeregningResultat;
  simuleringResultat: any;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
}

interface OwnState {
  tilbakekrevingText?: string;
}

export const VedtakAvslagRevurderingPanelImpl = ({
  intl,
  vilkar,
  beregningResultat,
  ytelseTypeKode,
  tilbakekrevingText = null,
  originaltBeregningResultat,
}: VedtakAvslagRevurderingPanelProps & OwnState & WrappedComponentProps) => (
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
      <AvslagsårsakListe vilkar={vilkar} />
      <VerticalSpacer sixteenPx />
    </div>
    <VerticalSpacer sixteenPx />
  </div>
);

const mapStateToProps = (state: OwnState, ownProps: VedtakAvslagRevurderingPanelProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagRevurderingPanelImpl));
