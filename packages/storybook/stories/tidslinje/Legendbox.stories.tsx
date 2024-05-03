import React from 'react';

import revurderingUrl from '@k9-sak-web/assets/images/endringstidspunkt.svg';
import fodselUrl from '@k9-sak-web/assets/images/fodsel.svg';
import ikkeOppfyltUrl from '@k9-sak-web/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@k9-sak-web/assets/images/oppfylt.svg';
import gradertImage from '@k9-sak-web/assets/images/periode_gradert.svg';
import manueltAvklart from '@k9-sak-web/assets/images/periode_manuelt_avklart.svg';
import soknadUrl from '@k9-sak-web/assets/images/soknad.svg';
import uavklartUrl from '@k9-sak-web/assets/images/uavklart.svg';
import { LegendBox } from '@k9-sak-web/tidslinje';

export default {
  title: 'tidslinje/Legendbox',
  component: LegendBox,
};

const legends = [
  {
    src: oppfyltUrl,
    text: 'Oppfylt periode',
  },
  {
    src: fodselUrl,
    text: 'Familiehendelse',
  },
  {
    src: ikkeOppfyltUrl,
    text: 'Ikke oppfylt periode',
  },
  {
    src: soknadUrl,
    text: 'Random periode',
  },
  {
    src: uavklartUrl,
    text: 'Something else periode',
  },
  {
    src: revurderingUrl,
    text: 'Revurderings periode',
  },
  {
    src: gradertImage,
    text: 'Gradert periode',
  },
  {
    src: manueltAvklart,
    text: 'Manuell periode',
  },
];

export const normal = () => (
  <div style={{ width: '200px' }}>
    <LegendBox legends={legends} />
  </div>
);
