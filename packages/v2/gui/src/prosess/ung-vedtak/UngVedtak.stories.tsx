import { behandlingType } from '@k9-sak-web/backend/ungsak/generated';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import type { Meta, StoryObj } from '@storybook/react';
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
  },
  component: UngVedtak,
  render: props => (
    <KodeverkProvider
      behandlingType={behandlingType.BT_002}
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
    },
    vilkår: [
      {
        vilkarType: 'UNG_VK_XXX',
        perioder: [
          {
            avslagKode: null,

            vilkarStatus: 'OPPFYLT',
          },
        ],
      },
      {
        vilkarType: 'K9_VK_3',
        perioder: [
          {
            avslagKode: null,
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
        vilkarType: 'UNG_VK_XXX',
        perioder: [
          {
            avslagKode: null,
            vilkarStatus: 'OPPFYLT',
          },
        ],
      },
      {
        vilkarType: 'K9_VK_3',
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
    },
    readOnly: false,
  },
};
