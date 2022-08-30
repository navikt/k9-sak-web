import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import { Column, Row } from 'nav-frontend-grid';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import VedtakOverlappendeYtelsePanel from './VedtakOverlappendeYtelsePanel';

export const getTextCode = behandlingStatus =>
  behandlingStatus === behandlingStatusCode.AVSLUTTET || behandlingStatus === behandlingStatusCode.IVERKSETTER_VEDTAK
    ? 'VedtakForm.vedtak'
    : 'VedtakForm.ForslagTilVedtak';

export const VedtakAksjonspunktPanelImpl = ({
  intl,
  children,
  behandlingStatusKode,
  aksjonspunktKoder,
  readOnly,
  overlappendeYtelser,
  alleKodeverk,
  viseFlereSjekkbokserForBrev,
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
        <VedtakOverlappendeYtelsePanel alleKodeverk={alleKodeverk} overlappendeYtelser={overlappendeYtelser} />
      )}
      <VerticalSpacer twentyPx />
      {children}
    </Column>
  </Row>
);

VedtakAksjonspunktPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  readOnly: PropTypes.bool.isRequired,
  aksjonspunktKoder: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  overlappendeYtelser: PropTypes.arrayOf(PropTypes.shape()),
  alleKodeverk: PropTypes.shape(),
  viseFlereSjekkbokserForBrev: PropTypes.bool,
};

VedtakAksjonspunktPanelImpl.defaultProps = {
  children: undefined,
};

export default injectIntl(VedtakAksjonspunktPanelImpl);
