import { IndicatorWithOverlay, InstitutionIcon, GreenCheckIconFilled } from '@navikt/ft-plattform-komponenter';
import React, { type JSX } from 'react';

const InnleggelsesperiodeIkonOverOppfylt = (): JSX.Element => (
  <IndicatorWithOverlay
    indicatorRenderer={() => <GreenCheckIconFilled />}
    overlayRenderer={() => <InstitutionIcon />}
  />
);

export default InnleggelsesperiodeIkonOverOppfylt;
