import type { MatchFagsakerResponse } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { type Meta, type StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { delay } from '../../../utils/delay';
import AndreSakerPåSøkerStripe from './AndreSakerPåSøkerStripe';

const meta = {
  title: 'gui/shared/statusstriper/AndreSakerPåSøkerStripe',
  component: AndreSakerPåSøkerStripe,
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
});

export const IngenAndreSaker: Story = {
  args: {
    søkerIdent: '12345678910',
    saksnummer: '1',
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    api: createMockApi([{ saksnummer: '1', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN }]),
  },
};

export const EnAnnenSak: Story = {
  args: {
    søkerIdent: '12345678910',
    saksnummer: '12',
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    api: createMockApi([{ saksnummer: '22', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN }]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Andre saker knyttet til søker:')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: '22' })).toBeInTheDocument();
  },
};

export const FlereAndreSaker: Story = {
  args: {
    søkerIdent: '12345678910',
    saksnummer: '11',
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    api: createMockApi([
      { saksnummer: '23', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN },
      { saksnummer: '34', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN },
      { saksnummer: '45', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN },
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Andre saker knyttet til søker:')).toBeInTheDocument();
    await expect(canvas.getByText('23,')).toBeInTheDocument();
    await expect(canvas.getByText('34,')).toBeInTheDocument();
    await expect(canvas.getByText('45')).toBeInTheDocument();
  },
};

export const MedFeil: Story = {
  args: {
    søkerIdent: '12345678910',
    saksnummer: '1',
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    api: createMockApi([], true),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Får ikke hentet andre saker knyttet til søker')).toBeInTheDocument();
  },
};

export const SaksnummerFiltrering: Story = {
  args: {
    søkerIdent: '12345678910',
    saksnummer: '24', // Dette saksnummeret filtreres bort fra resultatet
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    api: createMockApi([
      { saksnummer: '1124', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN },
      { saksnummer: '24', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN },
      { saksnummer: '335', ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN },
    ]),
  },
  play: async ({ canvas }) => {
    await delay(100);
    await expect(canvas.getByText('Andre saker knyttet til søker:')).toBeInTheDocument();
    await expect(canvas.getByText('1124,')).toBeInTheDocument();
    await expect(canvas.queryByText('24,')).not.toBeInTheDocument();
    await expect(canvas.getByText('335')).toBeInTheDocument();
  },
};
