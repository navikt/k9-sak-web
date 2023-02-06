import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Heading } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { SjekkTilbakekrevingType } from './VedtakForm';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import VedtakOverlappendeYtelsePanel from './VedtakOverlappendeYtelsePanel';
import VedtakSjekkTilbakekreving from './VedtakSjekkTilbakekreving';

export const getTextCode = behandlingStatus =>
  behandlingStatus === behandlingStatusCode.AVSLUTTET || behandlingStatus === behandlingStatusCode.IVERKSETTER_VEDTAK
    ? 'VedtakForm.vedtak'
    : 'VedtakForm.ForslagTilVedtak';

interface Props {
  intl: IntlShape;
  behandlingStatusKode: string;
  aksjonspunktKoder: string[];
  readOnly: boolean;
  overlappendeYtelser;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  viseFlereSjekkbokserForBrev: boolean;
  harVurdertOverlappendeYtelse: boolean;
  setHarVurdertOverlappendeYtelse: (harVurdertOverlappendeYtelse: boolean) => void;
  sjekkTilbakekreving: SjekkTilbakekrevingType;
  setSjekkTilbakekreving: (sjekkTilbakekreving: SjekkTilbakekrevingType) => void;
}

export const VedtakAksjonspunktPanelImpl: React.FC<Props> = ({
  intl,
  children,
  behandlingStatusKode,
  aksjonspunktKoder,
  readOnly,
  overlappendeYtelser,
  alleKodeverk,
  viseFlereSjekkbokserForBrev,
  harVurdertOverlappendeYtelse,
  setHarVurdertOverlappendeYtelse,
  sjekkTilbakekreving,
  setSjekkTilbakekreving,
}) => {
  const harOverlappendeYtelser = overlappendeYtelser && overlappendeYtelser.length > 0;

  return (
    <Row>
      <Column xs="8">
        <Heading level="2" size="medium" data-testid="vedtakAksjonspunktPanel">
          {intl.formatMessage({ id: getTextCode(behandlingStatusKode) })}
        </Heading>
        <VerticalSpacer twentyPx />
        {sjekkTilbakekreving?.visAksjonspunkt && (
          <VedtakSjekkTilbakekreving
            sjekkTilbakekreving={sjekkTilbakekreving}
            setSjekkTilbakekreving={setSjekkTilbakekreving}
          />
        )}
        {!harOverlappendeYtelser && (
          <VedtakHelpTextPanel
            aksjonspunktKoder={aksjonspunktKoder}
            readOnly={readOnly}
            viseFlereSjekkbokserForBrev={viseFlereSjekkbokserForBrev}
          />
        )}
        {harOverlappendeYtelser && (
          <VedtakOverlappendeYtelsePanel
            alleKodeverk={alleKodeverk}
            overlappendeYtelser={overlappendeYtelser}
            harVurdertOverlappendeYtelse={harVurdertOverlappendeYtelse}
            setHarVurdertOverlappendeYtelse={setHarVurdertOverlappendeYtelse}
          />
        )}
        <VerticalSpacer twentyPx />
        {children}
      </Column>
    </Row>
  );
};

export default injectIntl(VedtakAksjonspunktPanelImpl);
