import { OverlayedIcons } from '@k9-sak-web/gui/shared/indicatorWithOverlay/IndicatorWithOverlay.js';
import { InstitutionIcon, RedCrossIconFilled } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';

const InnleggelsesperiodeIkonOverIkkeOppfylt = (): JSX.Element => (
  <OverlayedIcons indicatorRenderer={() => <RedCrossIconFilled />} overlayRenderer={() => <InstitutionIcon />} />
);

export default InnleggelsesperiodeIkonOverIkkeOppfylt;
