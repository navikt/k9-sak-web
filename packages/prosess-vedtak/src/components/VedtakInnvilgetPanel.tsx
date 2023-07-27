import { isDelvisInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { findDelvisInnvilgetResultatText, findInnvilgetResultatText, findTilbakekrevingText } from './VedtakHelper';

interface VedtakInnvilgetPanelImplProps {
  intl: IntlShape;
  behandlingsresultat: Record<string, any>;
  ytelseTypeKode: string;
  tilbakekrevingText?: string;
}

export const VedtakInnvilgetPanelImpl = ({
  intl,
  behandlingsresultat,
  ytelseTypeKode,
  tilbakekrevingText,
}: VedtakInnvilgetPanelImplProps) => (
  <>
    <Label size="small" as="p" data-testid="innvilget">
      {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
    </Label>
    <BodyShort size="small">
      {intl.formatMessage({
        id: isDelvisInnvilget(behandlingsresultat.type.kode)
          ? findDelvisInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode)
          : findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode),
      })}
      {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
    </BodyShort>
    <VerticalSpacer eightPx />
  </>
);

VedtakInnvilgetPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
