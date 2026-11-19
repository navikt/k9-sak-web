import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import type { Dokument } from '../../../types/Dokument';
import { Dokumenttype } from '../../../types/Dokument';
import Dokumentnavigasjon from './Dokumentnavigasjon';

const lagDokument = (
  id: string,
  datert: string,
  type: Dokumenttype = Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
): Dokument => ({
  annenPartErKilde: false,
  behandlet: true,
  benyttet: true,
  bruktTilMinstEnVurdering: false,
  datert,
  duplikatAvId: null,
  duplikater: [],
  fremhevet: false,
  id,
  links: [],
  mottattDato: datert,
  mottattTidspunkt: datert + 'T10:00:00',
  navn: 'Dokument ' + id,
  type,
});

const seksDokumenter = [1, 2, 3, 4, 5, 6].map(n => lagDokument(String(n), '2022-01-0' + n));
const ikkeKlassifisertDokument = lagDokument('ikke-klassifisert', '2022-01-01', Dokumenttype.UKLASSIFISERT);
const filtreringsDokumenter = [ikkeKlassifisertDokument, lagDokument('klassifisert', '2022-01-02')];

const meta: Meta<typeof Dokumentnavigasjon> = {
  title: 'fakta/fakta-medisinsk-vilkår/Dokumentnavigasjon',
  component: Dokumentnavigasjon,
  args: {
    dokumenter: [],
    valgtDokument: null,
    onDokumentValgt: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const IngenDokumenter: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Vis melding når det ikke finnes dokumenter', async () => {
      await expect(canvas.getByText(/Ingen dokumenter å vise/i)).toBeInTheDocument();
    });
  },
};

export const Filtrering: Story = {
  args: {
    dokumenter: filtreringsDokumenter,
    valgtDokument: ikkeKlassifisertDokument,
    displayFilterOption: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Filtrer bort dokumenter som ikke er klassifisert', async () => {
      await expect(canvas.getByText(/ikke klassifisert/i)).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: 'Type' }));
      const ikkeKlassifisertCheckbox = await screen.findByLabelText(/ikke klassifisert/i);
      await userEvent.click(ikkeKlassifisertCheckbox);
      await userEvent.click(canvas.getAllByRole('button', { name: 'Type' })[1]);
      await waitFor(async () => {
        await expect(canvas.queryByText(/ikke klassifisert/i)).not.toBeInTheDocument();
      });
    });
  },
};

export const Nedtrekksfilter: Story = {
  args: {
    dokumenter: filtreringsDokumenter,
    valgtDokument: ikkeKlassifisertDokument,
    displayFilterOption: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Åpne og lukk nedtrekksfilteret', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Type' }));
      const ikkeKlassifisertCheckbox = await screen.findByLabelText(/ikke klassifisert/i);
      await expect(ikkeKlassifisertCheckbox).toBeTruthy();
      await userEvent.click(document.body);
      await waitFor(async () => {
        await expect(screen.queryByLabelText(/ikke klassifisert/i)).not.toBeInTheDocument();
      });
    });
  },
};

export const UtenPaginering: Story = {
  args: { dokumenter: seksDokumenter },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Ikke vis paginering når den er slått av', async () => {
      await expect(canvas.queryByRole('navigation')).not.toBeInTheDocument();
    });
  },
};

export const PagineringMedFlereEnnFemDokumenter: Story = {
  args: { dokumenter: seksDokumenter, usePagination: true },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Vis paginering og bare dokumentene på første side', async () => {
      await expect(canvas.getByRole('navigation')).toBeInTheDocument();
      await expect(canvas.getByText('01.01.2022')).toBeInTheDocument();
      await expect(canvas.getByText('05.01.2022')).toBeInTheDocument();
      await expect(canvas.queryByText('06.01.2022')).not.toBeInTheDocument();
    });
  },
};

export const NesteSide: Story = {
  args: { dokumenter: seksDokumenter, usePagination: true },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Naviger til neste side og vis riktig dokument', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Neste' }));
      await waitFor(async () => {
        await expect(canvas.getByText('06.01.2022')).toBeInTheDocument();
      });
      await expect(canvas.queryByText('01.01.2022')).not.toBeInTheDocument();
    });
  },
};
