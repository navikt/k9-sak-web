import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import ankeVurdering from '@k9-sak-web/kodeverk/src/ankeVurdering';
import AnkeProsessIndex from '@k9-sak-web/prosess-anke';

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
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForResultatVedStadfestYtelsesvedtak = () => (
  <AnkeProsessIndex
    behandling={behandling}
    ankeVurdering={object('ankeVurdering', {
      ankeVurderingResultat: {
        ankeVurdering: ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK,
        begrunnelse: 'Dette er en begrunnelse',
      },
    })}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
  />
);
