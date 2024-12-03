import { isDelvisInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Label } from '@navikt/ds-react';
import { BehandlingsresultatDto } from '@navikt/k9-sak-typescript-client';
import { IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { findDelvisInnvilgetResultatText, findInnvilgetResultatText, findTilbakekrevingText } from './VedtakHelper';

interface VedtakInnvilgetPanelProps {
  intl: IntlShape;
  behandlingsresultat: BehandlingsresultatDto;
  ytelseTypeKode: string;
  tilbakekrevingText?: string;
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

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
