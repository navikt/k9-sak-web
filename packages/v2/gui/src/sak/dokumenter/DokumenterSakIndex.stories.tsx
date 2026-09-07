import { k9_kodeverk_dokument_Kommunikasjonsretning as Kommunikasjonsretning } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import DokumenterSakIndex from './DokumenterSakIndex';
import { withQueryClientProvider } from '../../storybook/decorators/withQueryClientProvider.js';
import withK9Kodeverkoppslag from '../../storybook/decorators/withK9Kodeverkoppslag.js';
import withFeatureToggles from '../../storybook/decorators/withFeatureToggles.js';
import { DokumentfilterGruppe } from '@k9-sak-web/backend/k9sak/kodeverk/dokument/DokumentfilterGruppe.js';

const behandlingId = 1;

const dokumenter = [
  {
    behandlinger: [behandlingId],
    dokumentId: '1',
    gjelderFor: 'Arbeidsgiversen AS',
    journalpostId: '1',
    kommunikasjonsretning: Kommunikasjonsretning.INN,
    brevkode: 'INNTEKTSMELDING',
    dokumentgruppe: [DokumentfilterGruppe.INNTEKTSMELDING],
    tidspunkt: '2017-08-02T00:54:25.455',
    tittel: 'Inntektsmelding',
  },
  {
    behandlinger: [behandlingId],
    dokumentId: '2',
    gjelderFor: 'Søker',
    journalpostId: '2',
    kommunikasjonsretning: Kommunikasjonsretning.INN,
    brevkode: 'PLEIEPENGER_SOKNAD',
    dokumentgruppe: [DokumentfilterGruppe.SØKNAD],
    tidspunkt: '2017-06-01T08:00:00.000',
    tittel: 'Søknad om pleiepenger',
  },
  {
    behandlinger: [behandlingId],
    dokumentId: '3',
    gjelderFor: 'Søker',
    journalpostId: '3',
    kommunikasjonsretning: Kommunikasjonsretning.INN,
    brevkode: 'ETTERSENDELSE_PLEIEPENGER_SYKT_BARN',
    dokumentgruppe: [DokumentfilterGruppe.ETTERSENDELSE],
    tidspunkt: '2017-06-15T09:30:00.000',
    tittel: 'Ettersendelse til pleiepengersøknad',
  },
  {
    behandlinger: [behandlingId],
    dokumentId: '4',
    gjelderFor: 'Søker',
    journalpostId: '4',
    kommunikasjonsretning: Kommunikasjonsretning.INN,
    brevkode: 'K9_PUNSJ_INNSENDING',
    dokumentgruppe: [DokumentfilterGruppe.PUNSJ, DokumentfilterGruppe.SØKNAD],
    tidspunkt: '2017-07-01T12:00:00.000',
    tittel: 'Manuell registrering (punsj)',
  },
  {
    behandlinger: [],
    dokumentId: '5',
    gjelderFor: 'Arbeidsgiversen AS',
    journalpostId: '5',
    kommunikasjonsretning: Kommunikasjonsretning.INN,
    brevkode: 'INNTEKTSMELDING',
    dokumentgruppe: [DokumentfilterGruppe.INNTEKTSMELDING],
    tidspunkt: '2016-12-01T10:00:00.000',
    tittel: 'Inntektsmelding (tidligere behandling)',
  },
  {
    behandlinger: [],
    dokumentId: '6',
    gjelderFor: 'test',
    journalpostId: '6',
    kommunikasjonsretning: Kommunikasjonsretning.UT,
    brevkode: 'INNVILGELSE',
    tidspunkt: '2017-02-02T01:54:25.455',
    tittel: 'Innvilgelsesbrev',
  },
  {
    behandlinger: [],
    dokumentId: '7',
    gjelderFor: 'Dette er en lang tekst som skal kuttes',
    journalpostId: '7',
    kommunikasjonsretning: Kommunikasjonsretning.NOTAT,
    tidspunkt: '2017-01-02T10:54:25.455',
    tittel: 'Internt notat',
  },
];

const fagsak = {
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  person: {
    personnummer: '12345678910',
  },
};

const meta = {
  title: 'gui/sak/dokumenter/DokumenterSakIndex.tsx',
  component: DokumenterSakIndex,
  decorators: [
    withQueryClientProvider({ queries: { throwOnError: false } }),
    withK9Kodeverkoppslag(),
    withFeatureToggles({ DOKUMENTFILTER: true }),
  ],
} satisfies Meta<typeof DokumenterSakIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

const render: Story['render'] = props => (
  <div style={{ width: '700px', margin: '50px', padding: '20px', backgroundColor: 'white' }}>
    <DokumenterSakIndex {...props} />
  </div>
);

const defaultArgs = {
  saksnummer: 1,
  behandlingId: behandlingId,
  behandlingUuid: '1',
  fagsak: fagsak,
};

export const DefaultStory: Story = {
  args: { ...defaultArgs, documents: dokumenter },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Inntektsmelding' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Inntektsmelding (tidligere behandling)' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('combobox', { name: 'Dokumenttype' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Vis kun dokumenter fra denne behandlingen' }));
    await expect(
      canvas.queryByRole('link', { name: 'Inntektsmelding (tidligere behandling)' }),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('combobox', { name: 'Dokumenttype' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Vis kun dokumenter fra denne behandlingen' }));
    await expect(canvas.getByRole('link', { name: 'Inntektsmelding (tidligere behandling)' })).toBeInTheDocument();
  },
  render,
};

export const FiltrerInntektsmeldinger: Story = {
  args: { ...defaultArgs, documents: dokumenter },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Dokumenttype' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Inntektsmelding' }));
    await expect(canvas.getByRole('link', { name: 'Inntektsmelding' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Inntektsmelding (tidligere behandling)' })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: 'Søknad om pleiepenger' })).not.toBeInTheDocument();
  },
  render,
};

export const FiltrerSøknaderOgEttersendelser: Story = {
  args: { ...defaultArgs, documents: dokumenter },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Dokumenttype' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Søknad' }));
    await userEvent.click(canvas.getByRole('combobox', { name: 'Dokumenttype' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Ettersendelse' }));
    await expect(canvas.getByRole('link', { name: 'Søknad om pleiepenger' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Ettersendelse til pleiepengersøknad' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Manuell registrering (punsj)' })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: 'Inntektsmelding' })).not.toBeInTheDocument();
  },
  render,
};
