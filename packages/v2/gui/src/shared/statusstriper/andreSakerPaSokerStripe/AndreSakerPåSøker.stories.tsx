import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { MatchFagsakerResponse } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_kodeverk_behandling_BehandlingType as behandlingType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { delay } from '../../../utils/delay';
import AndreSakerPåSøkerStripe from './AndreSakerPåSøkerStripe';

const meta = {
  title: 'gui/shared/statusstriper/AndreSakerPåSøkerStripe',
  component: AndreSakerPåSøkerStripe,
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
} satisfies Meta<typeof AndreSakerPåSøkerStripe>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockApi = (responseData: MatchFagsakerResponse = [], shouldFail = false) => ({
  getAndreSakerPåSøker: () => {
    if (shouldFail) {
      return Promise.reject(new Error('Feil ved henting av saker'));
    }
    return Promise.resolve(responseData);
  },
  getUferdigePunsjoppgaver: () => {
    return Promise.resolve({ journalpostIder: [], journalpostIderBarn: [] });
  },
  getMerknader: () => {
    return Promise.resolve({
      hastesak: { aktiv: false },
      utenlandssak: { aktiv: false },
      direkteutbetaling: { aktiv: false },
    });
  },
  getÅpneGosysOppgaver: () => {
    return Promise.resolve([]);
  },
});

export const IngenAndreSaker: Story = {
  args: {
    saksnummer: '1',
    api: createMockApi([{ saksnummer: '1', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN }]),
  },
};

export const EnAnnenSak: Story = {
  args: {
    saksnummer: '12',
    api: createMockApi([
      {
        saksnummer: '5YC1S',
        ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
        status: fagsakStatus.LØPENDE,
        gyldigPeriode: { fom: '2022-04-13', tom: '2025-09-27' },
      },
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('1 annen sak knyttet til søker')).toBeInTheDocument();
    const visButton = canvas.getByRole('button', { name: 'Se saker' });
    await userEvent.click(visButton);
    await expect(canvas.getByRole('link', { name: '5YC1S:' })).toBeInTheDocument();
    await expect(canvas.getByText('13.04.2022 - 27.09.2025')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Skjul saker' })).toBeInTheDocument();
  },
};

export const FlereAndreSaker: Story = {
  args: {
    saksnummer: '5BAAAE',
    api: createMockApi([
      {
        saksnummer: 'J04PS',
        ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
        status: fagsakStatus.LØPENDE,
        gyldigPeriode: { fom: '2023-01-01', tom: '2023-12-31' },
      },
      {
        saksnummer: 'BIBIBI',
        ytelseType: fagsakYtelsesType.OPPLÆRINGSPENGER,
        status: fagsakStatus.LØPENDE,
        gyldigPeriode: { fom: '2023-01-01', tom: '2023-12-31' },
      },
      {
        saksnummer: '12LBY',
        ytelseType: fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
        status: fagsakStatus.LØPENDE,
        gyldigPeriode: { fom: '2023-01-01', tom: '2023-12-31' },
      },
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await userEvent.click(canvas.getByRole('button', { name: 'Se saker' }));
    await expect(canvas.getByRole('link', { name: 'J04PS:' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'BIBIBI:' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '12LBY:' })).toBeInTheDocument();
  },
};

export const MedFeil: Story = {
  args: {
    saksnummer: '1',
    api: createMockApi([], true),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Får ikke hentet andre saker knyttet til søker')).toBeInTheDocument();
  },
};

export const SaksnummerFiltrering: Story = {
  args: {
    saksnummer: '24', // Dette saksnummeret filtreres bort fra resultatet
    api: createMockApi([
      { saksnummer: '1124', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, status: fagsakStatus.LØPENDE },
      { saksnummer: '24', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, status: fagsakStatus.LØPENDE },
      { saksnummer: '335', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, status: fagsakStatus.LØPENDE },
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await userEvent.click(canvas.getByRole('button', { name: 'Se saker' }));
    await expect(canvas.getByRole('link', { name: '1124:' })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: '24:' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '335:' })).toBeInTheDocument();
  },
};

export const OmsorgsdagerFiltreresBort: Story = {
  args: {
    saksnummer: '1',
    api: createMockApi([
      { saksnummer: '2', ytelseType: fagsakYtelsesType.OMSORGSPENGER, status: fagsakStatus.LØPENDE },
      { saksnummer: '3', ytelseType: fagsakYtelsesType.OMSORGSPENGER_KS, status: fagsakStatus.LØPENDE },
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.queryByText('Andre saker knyttet til søker')).not.toBeInTheDocument();
  },
};

export const HistoriskSak: Story = {
  args: {
    saksnummer: '1',
    api: createMockApi([
      {
        saksnummer: '2',
        ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
        status: fagsakStatus.AVSLUTTET,
        gyldigPeriode: { fom: '2020-01-01', tom: '2020-06-30' },
      },
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await userEvent.click(canvas.getByRole('button', { name: 'Se saker' }));
    await expect(canvas.queryByRole('link', { name: '2' })).not.toBeInTheDocument();
    await expect(canvas.getByText('Historisk')).toBeInTheDocument();
  },
};

export const SakUtenSluttdato: Story = {
  args: {
    saksnummer: '1',
    api: createMockApi([
      {
        saksnummer: '2',
        ytelseType: fagsakYtelsesType.OPPLÆRINGSPENGER,
        status: fagsakStatus.LØPENDE,
        gyldigPeriode: { fom: '2026-03-12', tom: '9999-12-31' },
      },
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await userEvent.click(canvas.getByRole('button', { name: 'Se saker' }));
    await expect(canvas.getByText('12.03.2026 -')).toBeInTheDocument();
  },
};
