import {
  ung_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  ung_kodeverk_behandling_BehandlingType as BehandlingDtoType,
  ung_kodeverk_dokument_DokumentMalType,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { KodeverkProvider } from '../../kodeverk';
import { asyncAction } from '../../storybook/asyncAction';
import { FakeUngVedtakBackendApi } from '../../storybook/mocks/FakeUngVedtakBackendApi';
import { UngVedtak } from './UngVedtak';

const api = new FakeUngVedtakBackendApi();
const meta = {
  title: 'gui/prosess/ung-vedtak/UngVedtak.tsx',
  args: {
    aksjonspunkter: [],
    api,
    submitCallback: asyncAction('button-click'),
    vedtaksbrevValgResponse: {},
    refetchVedtaksbrevValg: fn(),
  },
  component: UngVedtak,
  render: props => (
    <KodeverkProvider
      behandlingType={BehandlingDtoType.FØRSTEGANGSSØKNAD}
      kodeverk={alleKodeverkV2}
      klageKodeverk={{}}
      tilbakeKodeverk={{}}
    >
      <UngVedtak {...props} />
    </KodeverkProvider>
  ),
} satisfies Meta<typeof UngVedtak>;
export default meta;

type Story = StoryObj<typeof meta>;

export const InnvilgetStory: Story = {
  args: {
    behandling: {
      behandlingsresultat: {
        type: 'INNVILGET',
      },
      id: 3000002,
      status: BehandlingDtoStatus.AVSLUTTET,
    },
    vilkår: [
      {
        vilkarType: 'UNG_VK_2',
        perioder: [
          {
            avslagKode: undefined,

            vilkarStatus: 'OPPFYLT',
          },
        ],
      },
      {
        vilkarType: 'UNG_VK_1',
        perioder: [
          {
            avslagKode: undefined,
            vilkarStatus: 'OPPFYLT',
          },
        ],
      },
    ],
    readOnly: false,
  },
};

export const AvslåttStory: Story = {
  args: {
    vilkår: [
      {
        vilkarType: 'UNG_VK_2',
        perioder: [
          {
            avslagKode: undefined,
            vilkarStatus: 'OPPFYLT',
          },
        ],
      },
      {
        vilkarType: 'UNG_VK_1',
        perioder: [
          {
            avslagKode: '1090',
            vilkarStatus: 'IKKE_OPPFYLT',
          },
        ],
      },
    ],
    behandling: {
      behandlingsresultat: {
        type: 'AVSLÅTT',
      },
      id: 3000001,
      status: BehandlingDtoStatus.AVSLUTTET,
    },
    readOnly: false,
  },
};

export const MedBrev: Story = {
  args: {
    behandling: {
      behandlingsresultat: {
        type: 'INNVILGET',
      },
      id: 3000002,
      status: BehandlingDtoStatus.OPPRETTET,
    },
    vilkår: [
      {
        vilkarType: 'UNG_VK_2',
        perioder: [
          {
            avslagKode: undefined,
            vilkarStatus: 'OPPFYLT',
          },
        ],
      },
      {
        vilkarType: 'UNG_VK_1',
        perioder: [
          {
            avslagKode: undefined,
            vilkarStatus: 'OPPFYLT',
          },
        ],
      },
    ],
    readOnly: false,
    aksjonspunkter: [
      {
        kanLoses: true,
      },
    ],
    vedtaksbrevValgResponse: {
      harBrev: true,
      vedtaksbrevValg: [
        {
          dokumentMalType: {
            kilde: ung_kodeverk_dokument_DokumentMalType.ENDRING_INNTEKT,
            navn: 'Endre inntekt',
            kode: 'ENDRE_INNTEKT',
            kodeverk: '',
          },
        },
        {
          dokumentMalType: {
            kilde: ung_kodeverk_dokument_DokumentMalType.ENDRING_HØY_SATS,
            navn: 'Endring høy sats',
            kode: 'ENDRE_HØY_SATS',
            kodeverk: '',
          },
        },
        // {
        //   brevMal: 'AVSLAG_UNG',
        //   navn: 'Avslag ungdomsytelse',
        //   støtterTredjepartsmottaker: false,
        // },
      ],
    },
  },
};
