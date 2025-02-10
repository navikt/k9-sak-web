import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { KlageVurdering } from '@k9-sak-web/types';
import {
  BehandlingDtoStatus,
  TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker,
} from '@navikt/k9-sak-typescript-client';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor } from '@storybook/test';
import TotrinnskontrollSakIndex from './TotrinnskontrollSakIndex';
import { Behandling } from './types/Behandling';
import { TotrinnskontrollAksjonspunkt } from './types/TotrinnskontrollAksjonspunkt';

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

const dataReadOnly = [
  {
    skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        opptjeningAktiviteter: [],
        beregningDtoer: [],
        besluttersBegrunnelse: 'asdfa',
        totrinnskontrollGodkjent: false,
        vurderPaNyttArsaker: [
          TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.FEIL_REGEL,
          TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.FEIL_FAKTA,
        ],
        uttakPerioder: [],
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

const meta: Meta<typeof TotrinnskontrollSakIndex> = {
  title: 'sak/sak-totrinnskontroll',
  component: TotrinnskontrollSakIndex,
};

export default meta;

type Story = StoryObj<typeof TotrinnskontrollSakIndex>;

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
    } as KlageVurdering,
    alleKodeverk: alleKodeverk as any,
    createLocationForSkjermlenke: () => location,
    readOnly: false,
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[0]);
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[1]);
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[2]);
    await userEvent.click(canvas.getAllByLabelText('Vurder på nytt')[3]);
    await userEvent.click(canvas.getByLabelText('Feil fakta'));
    await userEvent.click(canvas.getByLabelText('Feil lovanvendelse'));
    await userEvent.click(canvas.getByLabelText('Feil regelforståelse'));
    await userEvent.type(canvas.getByLabelText('Begrunnelse'), 'Dette er en begrunnelse');
    expect(canvas.getByRole('button', { name: 'Godkjenn vedtaket' })).toBeDisabled();
    expect(canvas.getByRole('button', { name: 'Send til saksbehandler' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Send til saksbehandler' }));
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    expect(args.onSubmit).toHaveBeenNthCalledWith(1, {
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
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[0]);
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[1]);
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[2]);
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[3]);
    expect(canvas.getByRole('button', { name: 'Godkjenn vedtaket' })).toBeEnabled();
    expect(canvas.getByRole('button', { name: 'Send til saksbehandler' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Godkjenn vedtaket' }));
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    expect(args.onSubmit).toHaveBeenNthCalledWith(1, {
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
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[0]);
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[1]);
    await userEvent.click(canvas.getAllByLabelText('Godkjent')[2]);
    await userEvent.click(canvas.getAllByLabelText('Vurder på nytt')[3]);
    await userEvent.type(canvas.getByLabelText('Begrunnelse'), 'Dette er en begrunnelse');
    await userEvent.click(canvas.getByRole('button', { name: 'Send til saksbehandler' }));
    expect(canvas.getByText('Feltet må fylles ut')).toBeInTheDocument();
  },
};

export const visTotrinnskontrollForSaksbehandler = () => (
  <div
    style={{
      width: '600px',
      margin: '50px',
      padding: '20px',
      backgroundColor: 'white',
    }}
  >
    <TotrinnskontrollSakIndex
      behandling={{
        ...behandling,
        status: BehandlingDtoStatus.UTREDES,
      }}
      totrinnskontrollSkjermlenkeContext={dataReadOnly}
      location={location}
      readOnly
      onSubmit={action('button-click')}
      behandlingKlageVurdering={
        {
          klageVurderingResultatNFP: {
            klageVurdering: 'STADFESTE_YTELSESVEDTAK',
          },
        } as KlageVurdering
      }
      alleKodeverk={alleKodeverk as any}
      createLocationForSkjermlenke={() => location}
    />
  </div>
);
