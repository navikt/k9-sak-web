import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import ForeldelseProsessIndex from '@fpsak-frontend/prosess-foreldelse';

import withReduxProvider from '../../../decorators/withRedux';

const perioderForeldelse = {
  perioder: [
    {
      fom: '2019-01-01',
      tom: '2019-02-02',
      belop: 1000,
      foreldelseVurderingType: {
        kode: foreldelseVurderingType.IKKE_FORELDET,
        kodeverk: 'FORELDELSE_VURDERING',
      },
    },
    {
      fom: '2019-02-03',
      tom: '2019-04-02',
      belop: 3000,
      foreldelseVurderingType: {
        kode: foreldelseVurderingType.FORELDET,
        kodeverk: 'FORELDELSE_VURDERING',
      },
    },
  ],
};

const alleKodeverk = {
  [tilbakekrevingKodeverkTyper.FORELDELSE_VURDERING]: [
    {
      kode: foreldelseVurderingType.IKKE_FORELDET,
      navn: 'Ikke foreldet',
      kodeverk: 'FORELDELSE_VURDERING',
    },
    {
      kode: foreldelseVurderingType.FORELDET,
      navn: 'Foreldet',
      kodeverk: 'FORELDELSE_VURDERING',
    },
  ],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'prosess/tilbakekreving/prosess-foreldelse',
  component: ForeldelseProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

const beregnBelop = params => {
  const { perioder } = params;
  return Promise.resolve({
    perioder,
  });
};

export const visAksjonspunktForForeldelse = () => (
  <ForeldelseProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    perioderForeldelse={object('perioderForeldelse', perioderForeldelse)}
    submitCallback={action('button-click')}
    isReadOnly={boolean('readOnly', false)}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE,
          kodeverk: '',
        },
      },
    ]}
    readOnlySubmitButton={boolean('readOnly', false)}
    navBrukerKjonn={NavBrukerKjonn.KVINNE}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    alleKodeverk={alleKodeverk}
    beregnBelop={params => beregnBelop(params)}
  />
);
