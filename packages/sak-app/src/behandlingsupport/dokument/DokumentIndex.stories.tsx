import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { k9_sak_kontrakt_fagsak_FagsakDto as FagsakDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi.js';
import { DokumentIndex } from './DokumentIndex.js';

const dokumenter = [
  {
    journalpostId: '1',
    dokumentId: '1',
    tittel: 'dok',
    tidspunkt: '2017-10-10T10:23:00',
    kommunikasjonsretning: 'INN',
  },
  {
    journalpostId: '2',
    dokumentId: '2',
    tittel: 'dok1',
    tidspunkt: '2019-10-10T10:23:00',
    kommunikasjonsretning: 'INN',
  },
  {
    journalpostId: '3',
    dokumentId: '3',
    tittel: 'dok2',
    tidspunkt: '2018-10-10T10:23:00',
    kommunikasjonsretning: 'INN',
  },
];

const meta = {
  title: 'sak/sak-app/behandlingsupport/dokument/DokumentIndex',
  component: DokumentIndex,
  beforeEach: () => {
    requestApi.clearMockData(K9sakApiKeys.ALL_DOCUMENTS);
    requestApi.mock(K9sakApiKeys.ALL_DOCUMENTS, dokumenter);
  },
  decorators: [withK9Kodeverkoppslag()],
} satisfies Meta<typeof DokumentIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SorterteDokumenter: Story = {
  args: {
    saksnummer: 123,
    behandlingId: 1,
    behandlingVersjon: 2,
    behandlingUuid: '1',
    fagsak: { saksnummer: '123', sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN } as FagsakDto,
  },
  play: async ({ canvas }) => {
    await canvas.findByRole('link', { name: 'dok' });
    const titler = canvas.getAllByRole('link', { name: /^dok\d?$/ }).map(lenke => lenke.textContent);
    await expect(titler).toEqual(['dok1', 'dok2', 'dok']);
  },
};
