import { type Meta, type StoryObj } from '@storybook/react';

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
};

export const MedFeil: Story = {
  args: {
    saksnummer: '123456789',
    pathToLos: '/los',
    api: createMockApi({}, true),
  },
};
