import { fagsakYtelsesType } from '@k9-sak-web/backend/ungsak/kodeverk/FagsakYtelsesType.js';
import { k9_sak_kontrakt_fagsak_FagsakDto as FagsakDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { UngSakApiKeys, requestApi } from '../../data/ungsakApi.js';
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
    kommunikasjonsretning: 'UT',
  },
  {
    journalpostId: '3',
    dokumentId: '3',
    tittel: 'dok2',
    tidspunkt: '2018-10-10T10:23:00',
    kommunikasjonsretning: 'INN',
  },
];

// Ung har ikke k9-sak-kodeverket, så storyen skal ikke ha withK9Kodeverkoppslag
const meta = {
  title: 'ung/sak-app/behandlingsupport/dokument/DokumentIndex',
  component: DokumentIndex,
  beforeEach: () => {
    requestApi.clearMockData(UngSakApiKeys.ALL_DOCUMENTS);
    requestApi.mock(UngSakApiKeys.ALL_DOCUMENTS, dokumenter);
  },
} satisfies Meta<typeof DokumentIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SorterteDokumenterUtenK9Kodeverk: Story = {
  args: {
    saksnummer: 123,
    behandlingId: 1,
    behandlingVersjon: 2,
    behandlingUuid: '1',
    fagsak: { saksnummer: '123', sakstype: fagsakYtelsesType.UNGDOMSYTELSE } as FagsakDto,
  },
  play: async ({ canvas }) => {
    await canvas.findByRole('link', { name: 'dok' });
    const titler = canvas.getAllByRole('link', { name: /^dok\d?$/ }).map(lenke => lenke.textContent);
    await expect(titler).toEqual(['dok1', 'dok2', 'dok']);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Dokumenttype' }));
    await expect(canvas.getAllByRole('option').map(valg => valg.textContent)).toEqual([
      'Vis kun dokumenter fra denne behandlingen',
      'Inngående dokumenter',
      'Utgående dokumenter',
    ]);
    await userEvent.click(canvas.getByRole('option', { name: 'Utgående dokumenter' }));
    await expect(canvas.getByRole('link', { name: 'dok1' })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: 'dok2' })).not.toBeInTheDocument();
  },
};
