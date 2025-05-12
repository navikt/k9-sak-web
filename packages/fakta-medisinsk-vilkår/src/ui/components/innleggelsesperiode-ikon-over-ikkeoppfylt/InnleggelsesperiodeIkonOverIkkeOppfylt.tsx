import { OverlayedIcons } from '@k9-sak-web/gui/shared/indicatorWithOverlay/IndicatorWithOverlay.js';
import { Buildings3Icon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';

const InnleggelsesperiodeIkonOverIkkeOppfylt = (): JSX.Element => (
  <OverlayedIcons
    indicatorRenderer={() => <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />}
    overlayRenderer={() => <Buildings3Icon fontSize={24} />}
  />
);

export default InnleggelsesperiodeIkonOverIkkeOppfylt;
