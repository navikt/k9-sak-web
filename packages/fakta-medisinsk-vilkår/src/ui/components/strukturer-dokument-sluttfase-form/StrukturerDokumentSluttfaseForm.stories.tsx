import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import LinkRel from '../../../constants/LinkRel';
import type Dokument from '../../../types/Dokument';
import { Dokumenttype } from '../../../types/Dokument';
import ContainerContext from '../../context/ContainerContext';
import StrukturerDokumentSluttfaseForm from './StrukturerDokumentSluttfaseForm';
const lagDokument = (id: string, datert: string, type: Dokumenttype): Dokument => ({
  annenPartErKilde: false,
  behandlet: true,
  benyttet: false,
  bruktTilMinstEnVurdering: false,
  datert,
  duplikatAvId: '',
  duplikater: [],
  fremhevet: false,
  id,
  links: [{ versjon: '1', rel: LinkRel.DOKUMENT_INNHOLD, type: 'GET', href: `/dokumenter/${id}` }],
  mottattDato: datert,
  mottattTidspunkt: `${datert}T10:00:00`,
  navn: `${id}.pdf`,
  type,
});
const dokument = lagDokument('dokument-1', '2024-01-15', Dokumenttype.LEGEERKLÆRING);
const duplikat: Dokument = {
  ...lagDokument('dokument-2', '2021-10-10', Dokumenttype.LEGEERKLÆRING),
  duplikatAvId: null,
};
const meta = {
  title: 'fakta/fakta-medisinsk-vilkår/StrukturerDokumentSluttfaseForm',
  component: StrukturerDokumentSluttfaseForm,
  args: { dokument, onSubmit: fn(), isSubmitting: false, strukturerteDokumenter: [] },
  decorators: [
    (Story, { parameters }) => (
      <ContainerContext.Consumer>
        {standardKontekst => (
          <ContainerContext.Provider value={{ ...standardKontekst, readOnly: parameters.readOnly === true }}>
            <Story />
          </ContainerContext.Provider>
        )}
      </ContainerContext.Consumer>
    ),
  ],
} satisfies Meta<typeof StrukturerDokumentSluttfaseForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Valg: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Kontroller valg og bekreft at dokumentet ikke inneholder medisinske opplysninger', async () => {
      const gruppe = canvas.getByRole('radiogroup', { name: 'Inneholder dokumentet medisinske opplysninger?' });
      await expect(within(gruppe).getAllByRole('radio')).toHaveLength(2);
      await expect(
        within(gruppe).getByRole('radio', { name: 'Ja, dokumentet inneholder medisinske opplysninger' }),
      ).toHaveAttribute('value', Dokumenttype.LEGEERKLÆRING);
      await expect(
        within(gruppe).getByRole('radio', { name: 'Nei, dokumentet inneholder ikke medisinske opplysninger' }),
      ).toHaveAttribute('value', Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER);
      await userEvent.click(
        within(gruppe).getByRole('radio', { name: 'Nei, dokumentet inneholder ikke medisinske opplysninger' }),
      );
      await userEvent.type(canvas.getByRole('textbox', { name: 'Hvilken dato er dokumentet datert?' }), '10.10.2021');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      });
      await expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER, datert: '2021-10-10' }),
      );
    });
  },
};
export const DatoFramITid: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Avvis dato fram i tid', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Ja, dokumentet inneholder medisinske opplysninger' }));
      const datofelt = canvas.getByRole('textbox', { name: 'Hvilken dato er dokumentet datert?' });
      await userEvent.type(datofelt, '01.01.2099');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(datofelt).toHaveAttribute('aria-invalid', 'true');
      });
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};
export const PåkrevdeFelt: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Vis feil når skjemaet er tomt', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(canvas.getAllByText('Du må oppgi en verdi')).toHaveLength(2);
      });
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};
export const Redigering: Story = {
  args: { editMode: true },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Forhåndsutfyll type og dato i redigeringsmodus', async () => {
      await expect(canvas.getByRole('button', { name: 'Oppdater' })).toBeInTheDocument();
      await expect(
        canvas.getByRole('radio', { name: 'Ja, dokumentet inneholder medisinske opplysninger' }),
      ).toBeChecked();
      await expect(canvas.getByRole('textbox', { name: 'Hvilken dato er dokumentet datert?' })).toHaveAttribute(
        'value',
        '15.01.2024',
      );
    });
  },
};
export const KunLesetilgang: Story = {
  parameters: { readOnly: true },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Skjul bekreftknappen i lesetilgang', async () => {
      await expect(canvas.queryByRole('button', { name: 'Bekreft' })).not.toBeInTheDocument();
    });
  },
};
export const Duplikatvalg: Story = {
  args: { onSubmit: fn(), strukturerteDokumenter: [duplikat] },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Velg dokumentet med samme dato som duplikat', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Ja, dokumentet inneholder medisinske opplysninger' }));
      await userEvent.type(canvas.getByRole('textbox', { name: 'Hvilken dato er dokumentet datert?' }), '10.10.2021');
      const duplikatvalg = canvas.getByRole('radio', { name: /10\.10\.2021/ });
      await expect(duplikatvalg).toBeInTheDocument();
      await userEvent.click(duplikatvalg);
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      });
      await expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ type: Dokumenttype.LEGEERKLÆRING, datert: '2021-10-10', duplikatAvId: duplikat.id }),
      );
    });
  },
};
