import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import AnkeProsessIndex from '@fpsak-frontend/prosess-anke';

import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const aksjonspunkter = [
  {
    definisjon: {
      kode: aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE,
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
    },
    begrunnelse: undefined,
  },
];

export default {
  title: 'prosess/anke/prosess-anke',
  component: AnkeProsessIndex,
  decorators: [withReduxProvider],
};

export const visPanelForResultatVedStadfestYtelsesvedtak = args => (
  <AnkeProsessIndex
    behandling={behandling}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    {...args}
  />
);

visPanelForResultatVedStadfestYtelsesvedtak.args = {
  ankeVurdering: {
    ankeVurderingResultat: {
      ankeVurdering: ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK,
      begrunnelse: 'Dette er en begrunnelse',
    },
  },
  readOnly: false,
  readOnlySubmitButton: false,
};
