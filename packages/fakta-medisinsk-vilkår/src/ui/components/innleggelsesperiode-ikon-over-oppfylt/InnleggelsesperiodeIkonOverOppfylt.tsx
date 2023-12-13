import { IndicatorWithOverlay, InstitutionIcon, GreenCheckIconFilled } from '@navikt/ft-plattform-komponenter';
import React from 'react';

const InnleggelsesperiodeIkonOverOppfylt = (): JSX.Element => (
  <IndicatorWithOverlay
    indicatorRenderer={() => <GreenCheckIconFilled />}
    overlayRenderer={() => <InstitutionIcon />}
  />
);

export default InnleggelsesperiodeIkonOverOppfylt;
