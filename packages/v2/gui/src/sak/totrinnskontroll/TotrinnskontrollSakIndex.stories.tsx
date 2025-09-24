import { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import { k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent } from 'storybook/test';
import TotrinnskontrollSakIndex from './TotrinnskontrollSakIndex.js';
import type { TotrinnskontrollBehandling } from './types/TotrinnskontrollBehandling.js';
import type { TotrinnskontrollData } from '../../behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import { K9KlageTotrinnskontrollData } from '../../behandling/support/totrinnskontroll/k9/K9KlageTotrinnskontrollBackendClient.js';
import withK9Kodeverkoppslag from '../../storybook/decorators/withK9Kodeverkoppslag.jsx';
import { K9KlageKodeverkoppslag } from '../../kodeverk/oppslag/K9KlageKodeverkoppslag.js';
import { oppslagKodeverkSomObjektK9Klage } from '../../kodeverk/mocks/oppslagKodeverkSomObjektK9Klage.js';
import { SkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type {
  K9KlageTotrinnskontrollSkjermlenkeContextDtoAdjusted,
  K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted,
} from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import { K9TilbakeKodeverkoppslag } from '../../kodeverk/oppslag/K9TilbakeKodeverkoppslag.js';
import { oppslagKodeverkSomObjektK9Tilbake } from '../../kodeverk/mocks/oppslagKodeverkSomObjektK9Tilbake.js';
import { K9TilbakeTotrinnskontrollData } from '../../behandling/support/totrinnskontroll/k9/K9TilbakeTotrinnskontrollBackendClient.js';

const klageTotrinnskontrollData = (): TotrinnskontrollData => {
  const klageKodeverkoppslag = new K9KlageKodeverkoppslag(oppslagKodeverkSomObjektK9Klage);
  const klageDtos: K9KlageTotrinnskontrollSkjermlenkeContextDtoAdjusted[] = [
    {
      skjermlenkeType: SkjermlenkeType.FORMKRAV_KLAGE_NFP,
      totrinnskontrollAksjonspunkter: [
        {
          aksjonspunktKode: AksjonspunktDefinisjon.VURDERING_AV_FORMKRAV_KLAGE_NFP,
          besluttersBegrunnelse: undefined,
          totrinnskontrollGodkjent: undefined,
          vurderPaNyttArsaker: [],
          arbeidsforholdDtos: [],
        },
      ],
    },
    {
      skjermlenkeType: SkjermlenkeType.BEREGNING,
      totrinnskontrollAksjonspunkter: [
        {
          aksjonspunktKode: AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
          besluttersBegrunnelse: undefined,
          totrinnskontrollGodkjent: undefined,
          vurderPaNyttArsaker: [],
          arbeidsforholdDtos: [],
        },
        {
          aksjonspunktKode: AksjonspunktDefinisjon.FATTER_VEDTAK,
          besluttersBegrunnelse: undefined,
          totrinnskontrollGodkjent: undefined,
          vurderPaNyttArsaker: [],
          arbeidsforholdDtos: [],
        },
      ],
    },

    {
      skjermlenkeType: SkjermlenkeType.FAKTA_OM_BEREGNING,
      totrinnskontrollAksjonspunkter: [
        {
          aksjonspunktKode: AksjonspunktDefinisjon.MANUELL_VURDERING_AV_KLAGE_NFP,
          besluttersBegrunnelse: undefined,
          totrinnskontrollGodkjent: undefined,
          vurderPaNyttArsaker: [],
          arbeidsforholdDtos: [],
        },
      ],
    },
  ];

  return new K9KlageTotrinnskontrollData(klageDtos, klageKodeverkoppslag);
};

const behandling: TotrinnskontrollBehandling = {
  id: 1,
  versjon: 2,
  status: BehandlingDtoStatus.FATTER_VEDTAK,
  type: BehandlingType.FØRSTEGANGSSØKNAD,
  toTrinnsBehandling: true,
  behandlingsresultatType: 'FASTSATT',
};

const meta = {
  title: 'gui/sak/totrinnskontroll',
  component: TotrinnskontrollSakIndex,
  decorators: [withK9Kodeverkoppslag()],
} satisfies Meta<typeof TotrinnskontrollSakIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SenderBehandlingTilbakeTilSaksbehandler: Story = {
  args: {
    behandling,
    totrinnskontrollData: klageTotrinnskontrollData(),
    onSubmit: fn(),
    behandlingKlageVurdering: {
      klageVurderingResultatNFP: {
        klageVurdering: 'STADFESTE_YTELSESVEDTAK',
      },
    },
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
            aksjonspunktKode: AksjonspunktDefinisjon.VURDERING_AV_FORMKRAV_KLAGE_NFP,
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: AksjonspunktDefinisjon.FATTER_VEDTAK,
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: AksjonspunktDefinisjon.MANUELL_VURDERING_AV_KLAGE_NFP,
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
            aksjonspunktKode: AksjonspunktDefinisjon.VURDERING_AV_FORMKRAV_KLAGE_NFP,
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: AksjonspunktDefinisjon.FATTER_VEDTAK,
            godkjent: true,
            begrunnelse: undefined,
            arsaker: [],
          },
          {
            aksjonspunktKode: AksjonspunktDefinisjon.MANUELL_VURDERING_AV_KLAGE_NFP,
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

const tilbakeTotrinnskontrollData = (): TotrinnskontrollData => {
  const tilbakeKodeverkoppslag = new K9TilbakeKodeverkoppslag(oppslagKodeverkSomObjektK9Tilbake);
  const dtos: K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[] = [
    {
      skjermlenkeType: SkjermlenkeType.FAKTA_OM_FEILUTBETALING,
      totrinnskontrollAksjonspunkter: [
        {
          aksjonspunktKode: '7003',
          besluttersBegrunnelse: undefined,
          totrinnskontrollGodkjent: undefined,
          vurderPaNyttArsaker: [],
        },
      ],
    },
    {
      skjermlenkeType: 'VEDTAK',
      totrinnskontrollAksjonspunkter: [
        {
          aksjonspunktKode: '5004',
          besluttersBegrunnelse: undefined,
          totrinnskontrollGodkjent: undefined,
          vurderPaNyttArsaker: [],
        },
      ],
    },
    {
      skjermlenkeType: 'TILBAKEKREVING',
      totrinnskontrollAksjonspunkter: [
        {
          aksjonspunktKode: '5002',
          besluttersBegrunnelse: undefined,
          totrinnskontrollGodkjent: undefined,
          vurderPaNyttArsaker: [],
        },
      ],
    },
    {
      skjermlenkeType: 'FORELDELSE',
      totrinnskontrollAksjonspunkter: [
        {
          aksjonspunktKode: '5003',
          besluttersBegrunnelse: undefined,
          totrinnskontrollGodkjent: undefined,
          vurderPaNyttArsaker: [],
        },
      ],
    },
  ];

  return new K9TilbakeTotrinnskontrollData(dtos, tilbakeKodeverkoppslag);
};

export const Tilbakekreving: Story = {
  args: {
    behandling: {
      type: 'BT-007',
      status: 'FVED',
      toTrinnsBehandling: true,
      behandlingsresultatType: 'IKKE_FASTSATT',
    },
    onSubmit: fn(),
    behandlingKlageVurdering: undefined,
    readOnly: false,
    totrinnskontrollData: tilbakeTotrinnskontrollData(),
  },
};
