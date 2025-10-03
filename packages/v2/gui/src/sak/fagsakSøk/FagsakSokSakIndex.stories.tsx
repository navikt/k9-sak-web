import {
  k9_kodeverk_behandling_BehandlingType as behandlingType,
  k9_kodeverk_behandling_FagsakStatus as fagsakStatus,
  k9_kodeverk_behandling_FagsakYtelseType as fagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect } from 'storybook/test';
import FagsakSøkSakIndexV2 from './FagsakSøkSakIndex';

const fagsaker = [
  {
    saksnummer: '1',
    sakstype: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    status: fagsakStatus.OPPRETTET,
    opprettet: '2017-08-02T00:54:25.455',
    endret: '',
  },
  {
    saksnummer: '2',
    sakstype: fagsakYtelseType.OMSORGSPENGER,
    status: fagsakStatus.OPPRETTET,
    opprettet: '2017-08-02T00:54:25.455',
    endret: '',
  },
];
const meta = {
  title: 'gui/sak/sok',
  component: FagsakSøkSakIndexV2,
  decorators: [
    Story => (
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <Story />
      </KodeverkProvider>
    ),
  ],
} satisfies Meta<typeof FagsakSøkSakIndexV2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fagsaker,
    searchFagsakCallback: action('button-click'),
    selectFagsakCallback: action('button-click'),
    searchResultReceived: false,
    searchStarted: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Saksnummer eller fødselsnummer/D-nummer')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Søk' })).toBeInTheDocument();
    await expect(canvas.getByText('Pleiepenger sykt barn')).toBeInTheDocument();
    await expect(canvas.getByText('Omsorgspenger')).toBeInTheDocument();
  },
};

export const SøkUtenTreff: Story = {
  args: {
    fagsaker: [],
    searchFagsakCallback: action('button-click'),
    selectFagsakCallback: action('button-click'),
    searchResultReceived: true,
    searchStarted: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Søket ga ingen treff')).toBeInTheDocument();
  },
};

export const SøkDerEnIkkeHarAdgang: Story = {
  args: {
    fagsaker: [],
    searchFagsakCallback: action('button-click'),
    selectFagsakCallback: action('button-click'),
    searchResultReceived: false,
    searchStarted: false,
    searchResultAccessDenied: {
      feilmelding: 'Har ikke adgang',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Har ikke adgang')).toBeInTheDocument();
  },
};
