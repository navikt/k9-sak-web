import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Behandlingsresultat, KodeverkMedNavn, Vilkar } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import AvslagsårsakListe from './AvslagsårsakListe';
import { findAvslagResultatText, findTilbakekrevingText } from './VedtakHelper';

interface VedtakAvslagPanelImplProps {
  intl: IntlShape;
  vilkar: Vilkar[];
  behandlingsresultat: Behandlingsresultat;
  ytelseTypeKode: string;
  tilbakekrevingText?: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

export const VedtakAvslagPanelImpl = ({
  intl,
  vilkar,
  behandlingsresultat,
  ytelseTypeKode,
  tilbakekrevingText,
  alleKodeverk,
}: VedtakAvslagPanelImplProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <div>
      <Label size="small" as="p" data-testid="avslaatt">
        {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
      </Label>
      <BodyShort size="small">
        {intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
        {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
      </BodyShort>
      <VerticalSpacer sixteenPx />

      <div>
        <Label size="small" as="p">
          {intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}
        </Label>
        <AvslagsårsakListe vilkar={vilkar} getKodeverknavn={getKodeverknavn} />
        <VerticalSpacer sixteenPx />
      </div>
    </div>
  );
};

VedtakAvslagPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagPanelImpl));
