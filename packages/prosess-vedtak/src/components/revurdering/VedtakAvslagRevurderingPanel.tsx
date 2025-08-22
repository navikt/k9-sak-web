import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Label } from '@navikt/ds-react';
import {
  k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto as TilbakekrevingValgDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import vedtakResultType from '../../kodeverk/vedtakResultType';
import { BeregningResultat } from '../../types/BeregningResultat';
import VedtakSimuleringResultat from '../../types/VedtakSimuleringResultat';
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

interface VedtakAvslagRevurderingPanelProps {
  vilkar: VilkårMedPerioderDto[];
  ytelseTypeKode: string;
  simuleringResultat: VedtakSimuleringResultat;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
  behandlingType: string | undefined;
}

interface OwnState {
  tilbakekrevingText?: string;
}

export const VedtakAvslagRevurderingPanelImpl = ({
  intl,
  vilkar,
  ytelseTypeKode,
  tilbakekrevingText = null,
}: VedtakAvslagRevurderingPanelProps & OwnState & WrappedComponentProps) => (
  <div>
    <Label size="small" as="p">
      {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
    </Label>
    {(ytelseTypeKode === fagsakYtelsesType.FRISINN || ytelseTypeKode === fagsakYtelsesType.OMSORGSPENGER) && (
      <BodyShort size="small">
        {intl.formatMessage({ id: findAvslagResultatText(undefined, ytelseTypeKode) })}
        {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
      </BodyShort>
    )}
    {ytelseTypeKode !== fagsakYtelsesType.FRISINN && ytelseTypeKode !== fagsakYtelsesType.OMSORGSPENGER && (
      <BodyShort size="small">{tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}</BodyShort>
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
