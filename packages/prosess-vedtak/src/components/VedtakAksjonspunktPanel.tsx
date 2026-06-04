import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { HGrid, Heading } from '@navikt/ds-react';
import {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_ytelser_OverlappendeYtelseDto as OverlappendeYtelseDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import React from 'react';
import { useIntl } from 'react-intl';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import VedtakOverlappendeYtelsePanel from './VedtakOverlappendeYtelsePanel';

const VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK_KODE = '5040';

const getTextCode = behandlingStatus =>
  behandlingStatus === behandlingStatusCode.AVSLUTTET || behandlingStatus === behandlingStatusCode.IVERKSETTER_VEDTAK
    ? 'VedtakForm.vedtak'
    : 'VedtakForm.ForslagTilVedtak';

interface Props {
  behandlingStatusKode: string;
  aksjonspunkter: AksjonspunktDto[];
  readOnly: boolean;
  overlappendeYtelser: Array<OverlappendeYtelseDto>;

  viseFlereSjekkbokserForBrev: boolean;
  harVurdertOverlappendeYtelse: boolean;
  setHarVurdertOverlappendeYtelse: (harVurdertOverlappendeYtelse: boolean) => void;
  submitCallback: (values: any[]) => void;
  children?: React.ReactNode;
}

export const VedtakAksjonspunktPanel: React.FC<Props> = ({
  children,
  behandlingStatusKode,
  aksjonspunkter,
  readOnly,
  overlappendeYtelser,

  viseFlereSjekkbokserForBrev,
  harVurdertOverlappendeYtelse,
  setHarVurdertOverlappendeYtelse,
}) => {
  const intl = useIntl();
  const harOverlappendeYtelser = overlappendeYtelser && overlappendeYtelser.length > 0;
  const er5040Utfort = aksjonspunkter.some(
    ap => ap.definisjon === VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK_KODE && ap.status === aksjonspunktStatus.UTFORT,
  );
  return (
    <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
      <div>
        <Heading level="2" size="medium" data-testid="vedtakAksjonspunktPanel">
          {intl.formatMessage({ id: getTextCode(behandlingStatusKode) })}
        </Heading>
        <VerticalSpacer twentyPx />
        {!harOverlappendeYtelser && (
          <VedtakHelpTextPanel
            aksjonspunktKoder={aksjonspunkter.map(ap => ap.definisjon).filter(v => v != undefined)}
            readOnly={readOnly}
            viseFlereSjekkbokserForBrev={viseFlereSjekkbokserForBrev}
          />
        )}
        {harOverlappendeYtelser && (
          <VedtakOverlappendeYtelsePanel
            overlappendeYtelser={overlappendeYtelser}
            readOnly={readOnly}
            aksjonspunktetErUtfort={er5040Utfort}
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

export default VedtakAksjonspunktPanel;
