import { type Meta, type StoryObj } from '@storybook/react';

import { expect } from 'storybook/test';
import { delay } from '../../../utils/delay';
import Punsjstripe from './Punsjstripe';

const meta = {
  title: 'gui/shared/statusstriper/Punsjstripe',
  component: Punsjstripe,
} satisfies Meta<typeof Punsjstripe>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockApi = (responseData = {}, shouldFail = false) => ({
  getAndreSakerPåSøker: () => {
    return Promise.resolve([]);
  },
  getUferdigePunsjoppgaver: () => {
    if (shouldFail) {
      return Promise.reject(new Error('Feil ved henting av punsjoppgaver'));
    }
    return Promise.resolve(responseData);
  },
});

export const IngenOppgaver: Story = {
  args: {
    saksnummer: '123456789',
    pathToLos: '/los',
    api: createMockApi({
      journalpostIder: [],
      journalpostIderBarn: [],
    }),
  },
};

export const EnOppgaveTilSøker: Story = {
  args: {
    saksnummer: '123456789',
    pathToLos: '/los',
    api: createMockApi({
      journalpostIder: [{ journalpostId: '456789123' }],
      journalpostIderBarn: [],
    }),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Det er 1 uløst oppgave tilknyttet søkeren i Punsj.')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til oppgave' })).toBeInTheDocument();
  },
};

export const FlereOppgaverTilSøker: Story = {
  args: {
    saksnummer: '123456789',
    pathToLos: '/los',
    api: createMockApi({
      journalpostIder: [{ journalpostId: '456789123' }, { journalpostId: '456789124' }, { journalpostId: '456789125' }],
      journalpostIderBarn: [],
    }),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Det er 3 uløste oppgaver tilknyttet søkeren i Punsj.')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '456789123' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '456789124' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '456789125' })).toBeInTheDocument();
  },
};

export const EnOppgaveTilBarn: Story = {
  args: {
    saksnummer: '123456789',
    pathToLos: '/los',
    api: createMockApi({
      journalpostIder: [],
      journalpostIderBarn: [{ journalpostId: '456789126' }],
    }),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Det er 1 uløst oppgave tilknyttet barnet i Punsj.')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til oppgave' })).toBeInTheDocument();
  },
};

export const OppgaverTilBådeSøkerOgBarn: Story = {
  args: {
    saksnummer: '123456789',
    pathToLos: '/los',
    api: createMockApi({
      journalpostIder: [{ journalpostId: '456789123' }],
      journalpostIderBarn: [{ journalpostId: '456789126' }],
    }),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Det er 1 uløst oppgave tilknyttet barnet i Punsj.')).toBeInTheDocument();
    await expect(canvas.getByText('Det er 1 uløst oppgave tilknyttet søkeren i Punsj.')).toBeInTheDocument();
    await expect(canvas.getAllByRole('link', { name: 'Gå til oppgave' })).toHaveLength(2);
  },
};

export const FlereOppgaverTilBådeSøkerOgBarn: Story = {
  args: {
    saksnummer: '123456789',
    pathToLos: '/los',
    api: createMockApi({
      journalpostIder: [{ journalpostId: '456789123' }, { journalpostId: '456789124' }],
      journalpostIderBarn: [{ journalpostId: '456789126' }, { journalpostId: '456789127' }],
    }),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Det er 2 uløste oppgaver tilknyttet barnet i Punsj.')).toBeInTheDocument();
    await expect(canvas.getByText('Det er 2 uløste oppgaver tilknyttet søkeren i Punsj.')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '456789123' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '456789124' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '456789126' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '456789127' })).toBeInTheDocument();
  },
};

export const MedFeil: Story = {
  args: {
    saksnummer: '123456789',
    pathToLos: '/los',
    api: createMockApi({}, true),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Får ikke kontakt med K9-Punsj')).toBeInTheDocument();
  },
};
