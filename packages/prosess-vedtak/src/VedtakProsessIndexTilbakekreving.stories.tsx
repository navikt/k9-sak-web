import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { aksjonspunktCodes as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus as AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktType.js';
import { BehandlingResultatType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Venteårsak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/Venteårsak.js';
import { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import VedtakProsessIndex from './VedtakProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FØRSTEGANGSSØKNAD,
  status: BehandlingStatus.UTREDES,
  språkkode: 'NO',
  behandlingsresultat: {
    vedtaksbrev: 'FRITEKST',
    type: BehandlingResultatType.IKKE_FASTSATT,
  },
  behandlingPåVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [
    {
      behandlingArsakType: klageBehandlingArsakType.ETTER_KLAGE,
    },
  ],
  opprettet: '2024-01-01',
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  uuid: '12345',
};

const meta: Meta<typeof VedtakProsessIndex> = {
  title: 'prosess/prosess-vedtak',
  component: VedtakProsessIndex,
};

export default meta;

const aksjonspunkt5085 = {
  aksjonspunktType: AksjonspunktType.MANUELL,
  begrunnelse: undefined,
  besluttersBegrunnelse: undefined,
  definisjon: AksjonspunktDefinisjon.SJEKK_TILBAKEKREVING,
  erAktivt: true,
  fristTid: undefined,
  kanLoses: true,
  status: AksjonspunktStatus.OPPRETTET,
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: undefined,
  vilkarType: undefined,
  vurderPaNyttArsaker: undefined,
  venteårsak: Venteårsak.UDEFINERT,
};

export const visSjekkTilbakekreving: StoryObj<typeof meta> = {
  args: {
    behandling,
    isReadOnly: false,
    vilkar: [],
    medlemskap: { fom: '2019-01-01' },
    aksjonspunkter: [aksjonspunkt5085],
    previewCallback: fn(),
    submitCallback: fn(),
  },
  play: async ({ args, canvas, step }) => {
    await step('Test å svare nei', async () => {
      const neiRadio = canvas.getByText('Nei, behandle denne behandlingen videre');
      await expect(neiRadio).toBeInTheDocument();
      await userEvent.click(neiRadio);
      const bekreftBtn = canvas.getByText('Bekreft');
      await userEvent.click(bekreftBtn);
      await expect(args.submitCallback).toHaveBeenCalledWith([{ kode: aksjonspunkt5085.definisjon }]);
    });
  },
};
