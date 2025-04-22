import { OverlayedIcons } from '@k9-sak-web/gui/shared/indicatorWithOverlay/IndicatorWithOverlay.js';
import { GreenCheckIconFilled, InstitutionIcon } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';

const InnleggelsesperiodeIkonOverOppfylt = (): JSX.Element => (
  <OverlayedIcons indicatorRenderer={() => <GreenCheckIconFilled />} overlayRenderer={() => <InstitutionIcon />} />
);

export default InnleggelsesperiodeIkonOverOppfylt;
