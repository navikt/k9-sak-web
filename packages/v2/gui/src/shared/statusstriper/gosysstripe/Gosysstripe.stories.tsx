import { OppgaveÅrsak } from '@k9-sak-web/backend/k9sak/kontrakt/oppgave/OppgaveÅrsak.js';
import { type Meta, type StoryObj } from '@storybook/react-vite';

import { expect } from 'storybook/test';
import { delay } from '../../../utils/delay';
import type { K9StatusBackendApi } from '../K9StatusBackendApi';
import Gosysstripe from './Gosysstripe';

const meta = {
  title: 'gui/shared/statusstriper/Gosysstripe',
  component: Gosysstripe,
} satisfies Meta<typeof Gosysstripe>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockApi = (oppgavetyper: OppgaveÅrsak[] = [], shouldFail = false): K9StatusBackendApi => ({
  getAndreSakerPåSøker: () => Promise.resolve([]),
  getUferdigePunsjoppgaver: () => Promise.resolve({}),
  getMerknader: () =>
    Promise.resolve({
      hastesak: { aktiv: false },
      utenlandssak: { aktiv: false },
      direkteutbetaling: { aktiv: false },
    }),
  getÅpneGosysOppgaver: () => {
    if (shouldFail) {
      return Promise.reject(new Error('Feil ved henting av Gosys-oppgaver'));
    }
    return Promise.resolve(oppgavetyper);
  },
});

export const IngenOppgaver: Story = {
  args: {
    saksnummer: '123456789',
    api: createMockApi([]),
  },
};

export const AlleOppgavetyperViViser: Story = {
  args: {
    saksnummer: '123456789',
    api: createMockApi([
      OppgaveÅrsak.VURDER_KONSEKVENS_YTELSE,
      OppgaveÅrsak.KONTAKT_BRUKER,
      OppgaveÅrsak.VURDER_DOKUMENT,
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText(/Det ligger åpne Gosys-oppgaver på søker/)).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til Gosys' })).toBeInTheDocument();
    await expect(canvas.getByText(/Vurder konsekvens for ytelse/)).toBeInTheDocument();
    await expect(canvas.getByText(/Kontakt bruker/)).toBeInTheDocument();
    await expect(canvas.getByText(/Vurder dokument/)).toBeInTheDocument();
  },
};

export const MedVurderHenvendelse: Story = {
  args: {
    saksnummer: '123456789',
    api: createMockApi([OppgaveÅrsak.VURDER_HENVENDELSE, OppgaveÅrsak.KONTAKT_BRUKER]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText(/Det ligger åpne Gosys-oppgaver på søker/)).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til Gosys' })).toBeInTheDocument();
    await expect(canvas.getByText(/Kontakt bruker/)).toBeInTheDocument();
  },
};

export const EnOppgavetype: Story = {
  args: {
    saksnummer: '123456789',
    api: createMockApi([OppgaveÅrsak.VURDER_KONSEKVENS_YTELSE]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText(/Det ligger åpne Gosys-oppgaver på søker/)).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til Gosys' })).toBeInTheDocument();
    await expect(canvas.getByText('Vurder konsekvens for ytelse')).toBeInTheDocument();
  },
};

export const MedFeil: Story = {
  args: {
    saksnummer: '123456789',
    api: createMockApi([], true),
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Får ikke hentet Gosys-oppgaver')).toBeInTheDocument();
  },
};
