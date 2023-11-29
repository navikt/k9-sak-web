import { IndicatorWithOverlay, InstitutionIcon, RedCrossIconFilled } from '@navikt/ft-plattform-komponenter';
import React from 'react';

const InnleggelsesperiodeIkonOverIkkeOppfylt = (): JSX.Element => (
  <IndicatorWithOverlay indicatorRenderer={() => <RedCrossIconFilled />} overlayRenderer={() => <InstitutionIcon />} />
);

export default InnleggelsesperiodeIkonOverIkkeOppfylt;
