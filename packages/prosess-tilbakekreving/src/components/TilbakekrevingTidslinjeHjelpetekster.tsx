import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import { LegendBox } from '@fpsak-frontend/tidslinje';

const TilbakekrevingTidslinjeHjelpetekster = ({ intl }: WrappedComponentProps) => {
  const legends = [
    {
      src: oppfyltUrl,
      text: intl.formatMessage({ id: 'Timeline.BelopTilbakereves' }),
    },
    {
      src: ikkeOppfyltUrl,
      text: intl.formatMessage({ id: 'Timeline.IngenTilbakekreving' }),
    },
    {
      src: uavklartUrl,
      text: intl.formatMessage({ id: 'Timeline.IkkeAvklartPeriode' }),
    },
  ];
  return <LegendBox legends={legends} />;
};

export default injectIntl(TilbakekrevingTidslinjeHjelpetekster);
