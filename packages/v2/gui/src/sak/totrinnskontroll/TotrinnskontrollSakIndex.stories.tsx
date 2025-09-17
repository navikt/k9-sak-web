import { behandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import { k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent } from 'storybook/test';
import TotrinnskontrollSakIndex from './TotrinnskontrollSakIndex';
import type { Behandling } from './types/Behandling';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';

const data: TotrinnskontrollSkjermlenkeContextDto[] = [
  {
    skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
    skjermlenkeTypeEnum: 'FORMKRAV_KLAGE_NFP',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        aksjonspunktDefinisjon: '5082',
        besluttersBegrunnelse: undefined,
        totrinnskontrollGodkjent: undefined,
        vurderPaNyttArsaker: [],
        arbeidsforholdDtos: [],
      },
    ],
  },
  {
    skjermlenkeType: 'BEREGNING',
    skjermlenkeTypeEnum: 'BEREGNING',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5038',
        aksjonspunktDefinisjon: '5038',
        beregningDtoer: [
          {
            fastsattVarigEndringNaering: false,
            faktaOmBeregningTilfeller: undefined,
            skjæringstidspunkt: '2020-01-01',
          },
        ],
        besluttersBegrunnelse: undefined,
        totrinnskontrollGodkjent: undefined,
        vurderPaNyttArsaker: [],
        arbeidsforholdDtos: [],
      },
      {
        aksjonspunktKode: '5039',
        aksjonspunktDefinisjon: '5039',
        beregningDtoer: [
          {
            fastsattVarigEndringNaering: true,
            fastsattVarigEndring: true,
            faktaOmBeregningTilfeller: undefined,
            skjæringstidspunkt: '2020-01-01',
          },
          {
            fastsattVarigEndringNaering: false,
            fastsattVarigEndring: false,
            faktaOmBeregningTilfeller: undefined,
            skjæringstidspunkt: '2020-02-01',
          },
        ],
        besluttersBegrunnelse: undefined,
        totrinnskontrollGodkjent: undefined,
        vurderPaNyttArsaker: [],
        arbeidsforholdDtos: [],
      },
    ],
  },

  {
    skjermlenkeType: 'FAKTA_OM_BEREGNING',
    skjermlenkeTypeEnum: 'FAKTA_OM_BEREGNING',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5058',
        aksjonspunktDefinisjon: '5058',
        beregningDtoer: [
          {
            fastsattVarigEndringNaering: undefined,
            faktaOmBeregningTilfeller: ['VURDER_LØNNSENDRING', 'VURDER_MOTTAR_YTELSE'],
            skjæringstidspunkt: '2020-01-01',
          },
        ],
        besluttersBegrunnelse: undefined,
        totrinnskontrollGodkjent: undefined,
        vurderPaNyttArsaker: [],
        arbeidsforholdDtos: [],
      },
    ],
  },
];

const location = {
  key: '1',
  pathname: '',
  search: '',
  state: {},
  hash: '',
};

const behandling = {
  status: BehandlingDtoStatus.FATTER_VEDTAK,
  type: behandlingType.FØRSTEGANGSSØKNAD,
  toTrinnsBehandling: true,
} as Behandling;

const meta = {
  title: 'gui/sak/totrinnskontroll',
  component: TotrinnskontrollSakIndex,
  decorators: [withKodeverkContext({ behandlingType: behandlingType.FØRSTEGANGSSØKNAD })],
} satisfies Meta<typeof TotrinnskontrollSakIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SenderBehandlingTilbakeTilSaksbehandler: Story = {
  args: {
    behandling,
    totrinnskontrollSkjermlenkeContext: data,
    location,
    onSubmit: fn(),
    behandlingKlageVurdering: {
      klageVurderingResultatNFP: {
        klageVurdering: 'STADFESTE_YTELSESVEDTAK',
      },
    },
    createLocationForSkjermlenke: () => location,
    readOnly: false,
  },
  play: async ({ args, canvas }) => {
    const godkjentTexts = canvas.getAllByLabelText('Godkjent');
    if (godkjentTexts[0]) {
      await userEvent.click(godkjentTexts[0]);
    }
    if (godkjentTexts[1]) {
      await userEvent.click(godkjentTexts[1]);
    }
    if (godkjentTexts[2]) {
      await userEvent.click(godkjentTexts[2]);
    }
    const vurderPåNyttTexts = canvas.getAllByLabelText('Vurder på nytt');
    if (vurderPåNyttTexts[3]) {
      await userEvent.click(vurderPåNyttTexts[3]);
    }
    await userEvent.click(canvas.getByLabelText('Feil fakta'));
    await userEvent.click(canvas.getByLabelText('Feil lovanvendelse'));
    await userEvent.click(canvas.getByLabelText('Feil regelforståelse'));
    await userEvent.type(canvas.getByLabelText('Begrunnelse'), 'Dette er en begrunnelse');
    await expect(canvas.getByRole('button', { name: 'Godkjenn vedtaket' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Send til saksbehandler' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Send til saksbehandler' }));
    await expect(args.onSubmit).toHaveBeenNthCalledWith(1, {
      fatterVedtakAksjonspunktDto: {
        '@type': '5016',
        begrunnelse: null,
        aksjonspunktGodkjenningDtos: [
          {
            aksjonspunktKode: '5082',
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: '5038',
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: '5039',
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: '5058',
            godkjent: false,
            begrunnelse: 'Dette er en begrunnelse',
            arsaker: ['FEIL_FAKTA', 'FEIL_LOV', 'FEIL_REGEL'],
          },
        ],
      },
      erAlleAksjonspunktGodkjent: false,
    });
  },
};

export const GodkjennerVedtak: Story = {
  args: {
    ...SenderBehandlingTilbakeTilSaksbehandler.args,
  },
  play: async ({ canvas, args }) => {
    const godkjentTexts = canvas.getAllByLabelText('Godkjent');
    if (godkjentTexts[0]) {
      await userEvent.click(godkjentTexts[0]);
    }
    if (godkjentTexts[1]) {
      await userEvent.click(godkjentTexts[1]);
    }
    if (godkjentTexts[2]) {
      await userEvent.click(godkjentTexts[2]);
    }
    if (godkjentTexts[3]) {
      await userEvent.click(godkjentTexts[3]);
    }
    await expect(canvas.getByRole('button', { name: 'Godkjenn vedtaket' })).toBeEnabled();
    await expect(canvas.getByRole('button', { name: 'Send til saksbehandler' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Godkjenn vedtaket' }));
    await expect(args.onSubmit).toHaveBeenNthCalledWith(1, {
      fatterVedtakAksjonspunktDto: {
        '@type': '5016',
        begrunnelse: null,
        aksjonspunktGodkjenningDtos: [
          {
            aksjonspunktKode: '5082',
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: '5038',
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: '5039',
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: '5058',
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
        ],
      },
      erAlleAksjonspunktGodkjent: true,
    });
  },
};

export const ViserFeilmeldingDersomCheckboxMangler: Story = {
  args: {
    ...SenderBehandlingTilbakeTilSaksbehandler.args,
  },
  play: async ({ canvas }) => {
    const godkjentTexts = canvas.getAllByLabelText('Godkjent');
    if (godkjentTexts[0]) {
      await userEvent.click(godkjentTexts[0]);
    }
    if (godkjentTexts[1]) {
      await userEvent.click(godkjentTexts[1]);
    }
    if (godkjentTexts[2]) {
      await userEvent.click(godkjentTexts[2]);
    }
    const vurderPåNyttTexts = canvas.getAllByLabelText('Vurder på nytt');
    if (vurderPåNyttTexts[3]) {
      await userEvent.click(vurderPåNyttTexts[3]);
    }
    await userEvent.type(canvas.getByLabelText('Begrunnelse'), 'Dette er en begrunnelse');
    await userEvent.click(canvas.getByRole('button', { name: 'Send til saksbehandler' }));
    await expect(canvas.getByText('Feltet må fylles ut')).toBeInTheDocument();
  },
};

export const Tilbakekreving: Story = {
  args: {
    behandling: {
      type: 'BT-007',
      status: 'FVED',
      toTrinnsBehandling: true,
      behandlingsresultat: {
        type: 'IKKE_FASTSATT',
      },
    },
    location,
    onSubmit: fn(),
    behandlingKlageVurdering: undefined,
    createLocationForSkjermlenke: () => location,
    readOnly: false,
    totrinnskontrollSkjermlenkeContext: [
      {
        skjermlenkeType: 'FAKTA_OM_FEILUTBETALING',
        skjermlenkeTypeEnum: 'FAKTA_OM_FEILUTBETALING',
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: '7003',
            aksjonspunktDefinisjon: '7003',
            besluttersBegrunnelse: undefined,
            totrinnskontrollGodkjent: undefined,
            vurderPaNyttArsaker: [],
          },
        ],
      },
      {
        skjermlenkeType: 'VEDTAK',
        skjermlenkeTypeEnum: 'VEDTAK',
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: '5004',
            aksjonspunktDefinisjon: '5004',
            besluttersBegrunnelse: undefined,
            totrinnskontrollGodkjent: undefined,
            vurderPaNyttArsaker: [],
          },
        ],
      },
      {
        skjermlenkeType: 'TILBAKEKREVING',
        skjermlenkeTypeEnum: 'TILBAKEKREVING',
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: '5002',
            aksjonspunktDefinisjon: '5002',
            besluttersBegrunnelse: undefined,
            totrinnskontrollGodkjent: undefined,
            vurderPaNyttArsaker: [],
          },
        ],
      },
      {
        skjermlenkeType: 'FORELDELSE',
        skjermlenkeTypeEnum: 'FORELDELSE',
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: '5003',
            aksjonspunktDefinisjon: '5003',
            besluttersBegrunnelse: undefined,
            totrinnskontrollGodkjent: undefined,
            vurderPaNyttArsaker: [],
          },
        ],
      },
    ],
  },
};
