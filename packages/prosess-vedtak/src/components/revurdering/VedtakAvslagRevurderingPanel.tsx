import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto as TilbakekrevingValgDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Label } from '@navikt/ds-react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import VedtakSimuleringResultat from '../../types/VedtakSimuleringResultat';
import AvslagsårsakListe from '../AvslagsårsakListe';
import { findAvslagResultatText, findTilbakekrevingText } from '../VedtakHelper';

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

const VedtakAvslagRevurderingPanelImpl = ({
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
