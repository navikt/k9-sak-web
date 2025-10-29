import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { HGrid, Heading } from '@navikt/ds-react';
import { k9_sak_kontrakt_ytelser_OverlappendeYtelseDto as OverlappendeYtelseDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import React from 'react';
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
  overlappendeYtelser: Array<OverlappendeYtelseDto>;

  viseFlereSjekkbokserForBrev: boolean;
  harVurdertOverlappendeYtelse: boolean;
  setHarVurdertOverlappendeYtelse: (harVurdertOverlappendeYtelse: boolean) => void;
  submitCallback: (values: any[]) => void;
  children?: React.ReactNode;
}

export const VedtakAksjonspunktPanelImpl: React.FC<Props> = ({
  intl,
  children,
  behandlingStatusKode,
  aksjonspunktKoder,
  readOnly,
  overlappendeYtelser,

  viseFlereSjekkbokserForBrev,
  harVurdertOverlappendeYtelse,
  setHarVurdertOverlappendeYtelse,
}) => {
  const harOverlappendeYtelser = overlappendeYtelser && overlappendeYtelser.length > 0;
  return (
    <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
      <div>
        <Heading level="2" size="medium" data-testid="vedtakAksjonspunktPanel">
          {intl.formatMessage({ id: getTextCode(behandlingStatusKode) })}
        </Heading>
        <VerticalSpacer twentyPx />
        {!harOverlappendeYtelser && (
          <VedtakHelpTextPanel
            aksjonspunktKoder={aksjonspunktKoder}
            readOnly={readOnly}
            viseFlereSjekkbokserForBrev={viseFlereSjekkbokserForBrev}
          />
        )}
        {harOverlappendeYtelser && (
          <VedtakOverlappendeYtelsePanel
            overlappendeYtelser={overlappendeYtelser}
            harVurdertOverlappendeYtelse={harVurdertOverlappendeYtelse}
            setHarVurdertOverlappendeYtelse={setHarVurdertOverlappendeYtelse}
          />
        )}
        <VerticalSpacer twentyPx />
        {children}
      </div>
    </HGrid>
  );
};

export default injectIntl(VedtakAksjonspunktPanelImpl);
