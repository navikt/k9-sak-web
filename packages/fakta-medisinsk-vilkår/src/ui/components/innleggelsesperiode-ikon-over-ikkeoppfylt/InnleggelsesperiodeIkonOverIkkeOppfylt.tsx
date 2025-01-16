import { IndicatorWithOverlay, InstitutionIcon, RedCrossIconFilled } from '@navikt/ft-plattform-komponenter';
import React, { type JSX } from 'react';

const InnleggelsesperiodeIkonOverIkkeOppfylt = (): JSX.Element => (
  <IndicatorWithOverlay indicatorRenderer={() => <RedCrossIconFilled />} overlayRenderer={() => <InstitutionIcon />} />
);

export default InnleggelsesperiodeIkonOverIkkeOppfylt;
