import React from 'react';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import { LegendBox } from '@fpsak-frontend/tidslinje';

const TilbakekrevingTidslinjeHjelpetekster = ({ intl }: WrappedComponentProps) => {
  const legends = [
    {
      src: oppfyltUrl,
      text: "Beløp tilbakekreves",
    },
    {
      src: ikkeOppfyltUrl,
      text: "Ingen tilbakekreving",
    },
    {
      src: uavklartUrl,
      text: "Uavklart periode",
    },
  ];
  return <LegendBox legends={legends} />;
};

export default injectIntl(TilbakekrevingTidslinjeHjelpetekster);
