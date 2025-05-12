import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import { BehandlingDtoStatus } from '@navikt/k9-sak-typescript-client';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor } from '@storybook/test';
import TotrinnskontrollSakIndex from './TotrinnskontrollSakIndex';
import type { Behandling } from './types/Behandling';
import type { TotrinnskontrollAksjonspunkt } from './types/TotrinnskontrollAksjonspunkt';

const data = [
  {
    skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        opptjeningAktiviteter: [],
        beregningDtoer: [],
        besluttersBegrunnelse: undefined,
        totrinnskontrollGodkjent: undefined,
        vurderPaNyttArsaker: [],
        uttakPerioder: [],
        arbeidsforholdDtos: [],
      } as TotrinnskontrollAksjonspunkt,
    ],
  },
  {
    skjermlenkeType: 'BEREGNING',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5038',
        opptjeningAktiviteter: [],
        beregningDtoer: [
          {
            fastsattVarigEndringNaering: false,
            faktaOmBeregningTilfeller: null,
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
        opptjeningAktiviteter: [],
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
            faktaOmBeregningTilfeller: null,
            skjæringstidspunkt: '2020-02-01',
          },
        ],
        besluttersBegrunnelse: undefined,
        totrinnskontrollGodkjent: undefined,
        vurderPaNyttArsaker: [],
        arbeidsforholdDtos: [],
      },
    ] as TotrinnskontrollAksjonspunkt[],
  },

  {
    skjermlenkeType: 'FAKTA_OM_BEREGNING',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5058',
        opptjeningAktiviteter: [],
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
    ] as TotrinnskontrollAksjonspunkt[],
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
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
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
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
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

export const Test: Story = {
  args: {
    behandling: {
      id: 13102,
      uuid: '390567b5-b1ff-4765-85b7-c4b4d24c5086',
      versjon: 19,
      type: {
        kode: 'BT-007',
        navn: 'Tilbakekreving',
        kodeverk: 'BEHANDLING_TYPE',
      },
      status: {
        kode: 'FVED',
        navn: 'Fatter vedtak',
        kodeverk: 'BEHANDLING_STATUS',
      },
      fagsakId: 2011701,
      opprettet: '2025-05-07T10:57:03.533',
      avsluttet: null,
      endret: '2025-05-08T08:46:31.048',
      behandlendeEnhetId: '4487',
      behandlendeEnhetNavn: 'Nav arbeid og ytelser - Sykdom i familien',
      toTrinnsBehandling: true,
      behandlingPåVent: false,
      fristBehandlingPåVent: null,
      venteÅrsakKode: null,
      språkkode: {
        kode: 'NB',
        navn: null,
        kodeverk: 'SPRAAK_KODE',
      },
      behandlingKøet: false,
      ansvarligSaksbehandler: 'Z990404',
      førsteÅrsak: null,
      behandlingÅrsaker: [],
      kanHenleggeBehandling: false,
      harVerge: false,
      behandlingsresultat: {
        type: {
          kode: 'IKKE_FASTSATT',
          navn: 'Ikke fastsatt',
          kodeverk: 'BEHANDLING_RESULTAT_TYPE',
        },
      },
      behandlingTillatteOperasjoner: {
        uuid: '390567b5-b1ff-4765-85b7-c4b4d24c5086',
        behandlingKanBytteEnhet: false,
        behandlingKanHenlegges: false,
        behandlingKanGjenopptas: false,
        behandlingKanOpnesForEndringer: false,
        behandlingKanSettesPaVent: false,
        behandlingKanSendeMelding: false,
        behandlingFraBeslutter: false,
        behandlingTilGodkjenning: true,
        vergeBehandlingsmeny: 'SKJUL',
      },
      totrinnskontrollÅrsaker: [
        {
          skjermlenkeType: 'TILBAKEKREVING',
          totrinnskontrollAksjonspunkter: [
            {
              aksjonspunktKode: '5002',
              besluttersBegrunnelse: null,
              totrinnskontrollGodkjent: null,
              vurderPaNyttArsaker: [],
            },
          ],
        },
        {
          skjermlenkeType: 'FAKTA_OM_FEILUTBETALING',
          totrinnskontrollAksjonspunkter: [
            {
              aksjonspunktKode: '7003',
              besluttersBegrunnelse: null,
              totrinnskontrollGodkjent: null,
              vurderPaNyttArsaker: [],
            },
          ],
        },
        {
          skjermlenkeType: 'VEDTAK',
          totrinnskontrollAksjonspunkter: [
            {
              aksjonspunktKode: '5004',
              besluttersBegrunnelse: null,
              totrinnskontrollGodkjent: null,
              vurderPaNyttArsaker: [],
            },
          ],
        },
        {
          skjermlenkeType: 'FORELDELSE',
          totrinnskontrollAksjonspunkter: [
            {
              aksjonspunktKode: '5003',
              besluttersBegrunnelse: null,
              totrinnskontrollGodkjent: null,
              vurderPaNyttArsaker: [],
            },
          ],
        },
      ],
      totrinnskontrollReadonly: false,
      brevmaler: null,
      links: [],
      sprakkode: {
        kode: 'NB',
        navn: null,
        kodeverk: 'SPRAAK_KODE',
      },
      fristBehandlingPaaVent: null,
      behandlingKoet: false,
      behandlingPaaVent: false,
      venteArsakKode: null,
    },
    location,
    onSubmit: fn(),
    behandlingKlageVurdering: undefined,
    createLocationForSkjermlenke: () => location,
    readOnly: false,
    totrinnskontrollSkjermlenkeContext: [
      {
        skjermlenkeType: 'FAKTA_OM_FEILUTBETALING',
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: '7003',
            besluttersBegrunnelse: null,
            totrinnskontrollGodkjent: null,
            vurderPaNyttArsaker: [],
          },
        ],
      },
      {
        skjermlenkeType: 'VEDTAK',
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: '5004',
            besluttersBegrunnelse: null,
            totrinnskontrollGodkjent: null,
            vurderPaNyttArsaker: [],
          },
        ],
      },
      {
        skjermlenkeType: 'TILBAKEKREVING',
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: '5002',
            besluttersBegrunnelse: null,
            totrinnskontrollGodkjent: null,
            vurderPaNyttArsaker: [],
          },
        ],
      },
      {
        skjermlenkeType: 'FORELDELSE',
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: '5003',
            besluttersBegrunnelse: null,
            totrinnskontrollGodkjent: null,
            vurderPaNyttArsaker: [],
          },
        ],
      },
    ],
  },
};
