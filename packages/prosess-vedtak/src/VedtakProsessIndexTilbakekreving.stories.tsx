import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { expect, fn, userEvent } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/react';
import VedtakProsessIndex from './VedtakProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FØRSTEGANGSSØKNAD,
  status: behandlingStatus.BEHANDLING_UTREDES,
  sprakkode: 'NO',
  behandlingsresultat: {
    vedtaksbrev: 'FRITEKST',
    type: behandlingResultatType.IKKE_FASTSATT,
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [
    {
      behandlingArsakType: klageBehandlingArsakType.ETTER_KLAGE,
    },
  ],
};

const meta: Meta<typeof VedtakProsessIndex> = {
  title: 'prosess/prosess-vedtak',
  component: args => (
    <KodeverkProvider
      behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
      kodeverk={alleKodeverkV2}
      klageKodeverk={{}}
      tilbakeKodeverk={{}}
    >
      <VedtakProsessIndex {...args} />
    </KodeverkProvider>
  ),
};

export default meta;

const aksjonspunkt5085 = {
  aksjonspunktType: 'MANU', // AKSJONSPUNKT_TYPE
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: '5085', // AKSJONSPUNKT_DEF
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: 'OPPR', // AKSJONSPUNKT_STATUS
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: '-', // VENT_AARSAK
};

export const visSjekkTilbakekreving: StoryObj<typeof meta> = {
  args: {
    behandling,
    sendVarselOmRevurdering: false,
    employeeHasAccess: false,
    isReadOnly: false,
    vilkar: [],
    medlemskap: { fom: '2019-01-01' },
    aksjonspunkter: [aksjonspunkt5085],
    alleKodeverk,
    previewCallback: fn(),
    submitCallback: fn(),
  },
  play: async ({ args, canvas, step }) => {
    await step('Test å svare nei', async () => {
      const neiRadio = canvas.getByText('Nei, behandle denne behandlingen videre');
      expect(neiRadio).toBeInTheDocument();
      await userEvent.click(neiRadio);
      const bekreftBtn = canvas.getByText('Bekreft');
      await userEvent.click(bekreftBtn);
      await expect(args.submitCallback).toHaveBeenCalledWith([{ kode: aksjonspunkt5085.definisjon }]);
    });
  },
};
