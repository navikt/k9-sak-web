import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { kodeverk_dokument_Kommunikasjonsretning as Kommunikasjonsretning } from '@k9-sak-web/backend/k9sak/generated';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from 'storybook/test';
import DokumenterSakIndex from './DokumenterSakIndex';

const behandlingId = 1;

const dokumenter = [
  {
    behandlinger: [behandlingId],
    dokumentId: '1',
    gjelderFor: 'test',
    journalpostId: '1',
    kommunikasjonsretning: Kommunikasjonsretning.INN,
    tidspunkt: '2017-08-02T00:54:25.455',
    tittel: 'Dette er et dokument',
  },
  {
    behandlinger: [],
    dokumentId: '2',
    gjelderFor: 'test',
    journalpostId: '2',
    kommunikasjonsretning: Kommunikasjonsretning.UT,
    tidspunkt: '2017-02-02T01:54:25.455',
    tittel: 'Dette er et nytt dokument',
  },
  {
    behandlinger: [],
    dokumentId: '3',
    gjelderFor: 'Dette er en lang tekst som skal kuttes',
    journalpostId: '3',
    kommunikasjonsretning: Kommunikasjonsretning.NOTAT,
    tidspunkt: '2017-01-02T10:54:25.455',
    tittel: 'Dette er et tredje dokument',
  },
];

const fagsak = {
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  person: {
    personnummer: '12345678910',
  },
};

const meta = {
  title: 'gui/sak/sak-dokumenter/DokumenterSakIndex.tsx',
  component: DokumenterSakIndex,
} satisfies Meta<typeof DokumenterSakIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    documents: dokumenter,
    saksnummer: 1,
    behandlingId: behandlingId,
    behandlingUuid: '1',
    fagsak: fagsak,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Dette er et dokument')).toBeInTheDocument();
    await expect(canvas.getByText('Dette er et tredje dokument')).toBeInTheDocument();
    await expect(canvas.getByText('02.01.2017 - 10:54')).toBeInTheDocument();
    await userEvent.selectOptions(canvas.getByRole('combobox'), 'Denne behandlingen');
    await expect(canvas.getByText('Dette er et dokument')).toBeInTheDocument();
    await expect(canvas.queryByText('Dette er et tredje dokument')).not.toBeInTheDocument();
    await userEvent.selectOptions(canvas.getByRole('combobox'), 'Alle behandlinger');
    await expect(canvas.getByText('Dette er et tredje dokument')).toBeInTheDocument();
  },
  render: props => (
    <div
      style={{
        width: '700px',
        margin: '50px',
        padding: '20px',
        backgroundColor: 'white',
      }}
    >
      <DokumenterSakIndex {...props} />
    </div>
  ),
};
