import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Label } from '@navikt/ds-react';
import {
  k9_sak_kontrakt_behandling_BehandlingsresultatDto as BehandlingsresultatDto,
  k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto as TilbakekrevingValgDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import VedtakSimuleringResultat from '../types/VedtakSimuleringResultat';
import AvslagsårsakListe from './AvslagsårsakListe';
import { findAvslagResultatText, findTilbakekrevingText } from './VedtakHelper';

interface VedtakAvslagPanelProps {
  vilkar: VilkårMedPerioderDto[];
  behandlingsresultat: BehandlingsresultatDto;
  ytelseTypeKode: string;
  tilbakekrevingText?: string;
  simuleringResultat: VedtakSimuleringResultat;
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
  tilbakekrevingvalg: TilbakekrevingValgDto;
}

export const VedtakAvslagPanelImpl = ({
  intl,
  vilkar,
  behandlingsresultat,
  ytelseTypeKode,
  tilbakekrevingText = null,
}: VedtakAvslagPanelProps & WrappedComponentProps) => {
  return (
    <div>
      <Label size="small" as="p" data-testid="avslaatt">
        {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
      </Label>
      <BodyShort size="small">
        {intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type, ytelseTypeKode) })}
        {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
      </BodyShort>
      <VerticalSpacer sixteenPx />

      <div>
        <Label size="small" as="p">
          {intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}
        </Label>
        <AvslagsårsakListe vilkar={vilkar} />
        <VerticalSpacer sixteenPx />
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps: VedtakAvslagPanelProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagPanelImpl));
