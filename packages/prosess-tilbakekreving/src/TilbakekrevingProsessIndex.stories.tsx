import { action } from '@storybook/addon-actions';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import TilbakekrevingProsessIndex from './TilbakekrevingProsessIndex';
import DetaljerteFeilutbetalingsperioder from './types/detaljerteFeilutbetalingsperioderTsType';
import FeilutbetalingPerioderWrapper from './types/feilutbetalingPerioderTsType';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import alleKodeverkTilbakeV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkTilbakeV2.json';

const perioderForeldelse = {
  perioder: [
    {
      fom: '2019-01-01',
      tom: '2019-02-02',
      belop: 1000,
      foreldelseVurderingType: foreldelseVurderingType.IKKE_FORELDET, // FORELDELSE_VURDERING
    },
    {
      fom: '2019-02-03',
      tom: '2019-04-02',
      belop: 3000,
      foreldelseVurderingType: foreldelseVurderingType.FORELDET, // FORELDELSE_VURDERING
    },
  ],
} as FeilutbetalingPerioderWrapper;

const vilkarvurderingsperioder = {
  perioder: [
    {
      fom: '2019-01-01',
      tom: '2019-04-01',
      foreldet: false,
      feilutbetaling: 10,
      årsak: {
        hendelseType: 'MEDLEMSKAP', // kodeverk: '', navn: '§22 Medlemskap'
      },
      redusertBeloper: [],
      ytelser: [
        {
          aktivitet: 'Arbeidstaker',
          belop: 1050,
        },
      ],
    },
  ],
  rettsgebyr: 1000,
} as DetaljerteFeilutbetalingsperioder;

const vilkarvurdering = {
  vilkarsVurdertePerioder: [],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'prosess/tilbakekreving/prosess-tilbakekreving',
  component: TilbakekrevingProsessIndex,
};

const beregnBelop = params => {
  const { perioder } = params;
  return Promise.resolve({
    perioder,
  });
};

export const visAksjonspunktForTilbakekreving = args => (
  <KodeverkProvider
    behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={undefined}
    tilbakeKodeverk={alleKodeverkTilbakeV2}
  >
    <TilbakekrevingProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
        } as Behandling
      }
      submitCallback={action('button-click') as () => Promise<any>}
      navBrukerKjonn={NavBrukerKjonn.KVINNE}
      alleKodeverk={alleKodeverkTilbakeV2 as any}
      beregnBelop={params => beregnBelop(params)}
      aksjonspunkter={
        [
          {
            definisjon: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
          },
        ] as Aksjonspunkt[]
      }
      {...args}
    />
  </KodeverkProvider>
);

visAksjonspunktForTilbakekreving.args = {
  perioderForeldelse,
  vilkarvurderingsperioder,
  vilkarvurdering,
  isReadOnly: false,
  readOnlySubmitButton: false,
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING]: merknaderFraBeslutter,
  },
};
