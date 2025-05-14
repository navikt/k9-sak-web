import { OverlayedIcons } from '@k9-sak-web/gui/shared/indicatorWithOverlay/IndicatorWithOverlay.js';
import { Buildings3Icon, CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';

const InnleggelsesperiodeIkonOverOppfylt = (): JSX.Element => (
  <OverlayedIcons
    indicatorRenderer={() => <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />}
    overlayRenderer={() => <Buildings3Icon fontSize={24} />}
  />
);

export default InnleggelsesperiodeIkonOverOppfylt;
