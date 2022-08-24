import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import AlleKodeverk from '@k9-sak-web/types/src/kodeverk';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import VedtakOverlappendeYtelsePanel from './VedtakOverlappendeYtelsePanel';

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
  alleKodeverk: AlleKodeverk;
  viseFlereSjekkbokserForBrev: boolean;
  harVurdertOverlappendeYtelse: boolean;
  setHarVurdertOverlappendeYtelse: (harVurdertOverlappendeYtelse: boolean) => void;
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
}) => (
  <Row>
    <Column xs="8">
      <Undertittel data-testid="vedtakAksjonspunktPanel">
        {intl.formatMessage({ id: getTextCode(behandlingStatusKode) })}
      </Undertittel>
      <VerticalSpacer twentyPx />
      <VedtakHelpTextPanel
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={readOnly}
        viseFlereSjekkbokserForBrev={viseFlereSjekkbokserForBrev}
      />
      {overlappendeYtelser && overlappendeYtelser.length > 0 && (
        <VedtakOverlappendeYtelsePanel
          aksjonspunktKoder={aksjonspunktKoder}
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

export default injectIntl(VedtakAksjonspunktPanelImpl);
