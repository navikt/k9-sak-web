import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import ForeldelseProsessIndex from './ForeldelseProsessIndex';

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
};

const beregnBelop = params => {
  const { perioder } = params;
  return Promise.resolve({
    perioder,
  });
};

export const visAksjonspunktForForeldelse = args => (
  <ForeldelseProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    submitCallback={action('button-click')}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE,
          kodeverk: '',
        },
      },
    ]}
    navBrukerKjonn={NavBrukerKjonn.KVINNE}
    alleKodeverk={alleKodeverk}
    beregnBelop={params => beregnBelop(params)}
    {...args}
  />
);

visAksjonspunktForForeldelse.args = {
  perioderForeldelse,
  isReadOnly: false,
  readOnlySubmitButton: false,
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE]: merknaderFraBeslutter,
  },
};
