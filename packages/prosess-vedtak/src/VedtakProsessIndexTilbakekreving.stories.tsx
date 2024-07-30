import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { expect, fn, userEvent } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/react';
import VedtakProsessIndex from './VedtakProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: behandlingType.SOKNAD,
    kodeverk: '',
  },
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
    kodeverk: '',
  },
  sprakkode: {
    kode: 'NO',
    kodeverk: '',
  },
  behandlingsresultat: {
    vedtaksbrev: {
      kode: 'FRITEKST',
      kodeverk: '',
    },
    type: {
      kode: behandlingResultatType.IKKE_FASTSATT,
      kodeverk: '',
    },
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [
    {
      behandlingArsakType: {
        kode: klageBehandlingArsakType.ETTER_KLAGE,
        kodeverk: '',
      },
    },
  ],
};

const meta: Meta<typeof VedtakProsessIndex> = {
  title: 'prosess/prosess-vedtak',
  component: VedtakProsessIndex,
};

export default meta;

const aksjonspunkt5085 = {
  aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '5085',
    kodeverk: 'AKSJONSPUNKT_DEF',
  },
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: { kode: 'OPPR', kodeverk: 'AKSJONSPUNKT_STATUS' },
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: { kode: '-', kodeverk: 'VENT_AARSAK' },
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
      await expect(args.submitCallback).toHaveBeenCalledWith([{ kode: aksjonspunkt5085.definisjon.kode }]);
    });
  },
};
