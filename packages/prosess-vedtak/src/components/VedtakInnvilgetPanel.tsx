import { isDelvisInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Label } from '@navikt/ds-react';
import {
  sak_kontrakt_behandling_BehandlingsresultatDto as BehandlingsresultatDto,
  sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto as TilbakekrevingValgDto,
} from '@navikt/k9-sak-typescript-client';
import { IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import VedtakSimuleringResultat from '../types/VedtakSimuleringResultat';
import { findDelvisInnvilgetResultatText, findInnvilgetResultatText, findTilbakekrevingText } from './VedtakHelper';

interface VedtakInnvilgetPanelProps {
  intl: IntlShape;
  behandlingsresultat: BehandlingsresultatDto;
  ytelseTypeKode: string;
  tilbakekrevingText?: string;
  simuleringResultat: VedtakSimuleringResultat;
  tilbakekrevingvalg?: TilbakekrevingValgDto;
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
  behandlingType: string | undefined;
}

export const VedtakInnvilgetPanelImpl = ({
  intl,
  behandlingsresultat,
  ytelseTypeKode,
  tilbakekrevingText = null,
}: VedtakInnvilgetPanelProps) => (
  <>
    <Label size="small" as="p" data-testid="innvilget">
      {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
    </Label>
    <BodyShort size="small">
      {intl.formatMessage({
        id: isDelvisInnvilget(behandlingsresultat.type)
          ? findDelvisInnvilgetResultatText(behandlingsresultat.type, ytelseTypeKode)
          : findInnvilgetResultatText(behandlingsresultat.type, ytelseTypeKode),
      })}
      {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
    </BodyShort>
    <VerticalSpacer eightPx />
  </>
);

const mapStateToProps = (state, ownProps: VedtakInnvilgetPanelProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
