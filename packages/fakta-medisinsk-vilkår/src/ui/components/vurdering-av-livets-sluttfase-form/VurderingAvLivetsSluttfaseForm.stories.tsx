import React from 'react';
import { Period } from '@fpsak-frontend/utils';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import LinkRel from '../../../constants/LinkRel';
import type Dokument from '../../../types/Dokument';
import { Dokumenttype } from '../../../types/Dokument';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import ContainerContext from '../../context/ContainerContext';
import VurderingAvLivetsSluttfaseForm, {
  type VurderingAvLivetsSluttfaseFormState,
} from './VurderingAvLivetsSluttfaseForm';

const lagDokument = (id: string, datert: string): Dokument => ({
  annenPartErKilde: false,
  behandlet: true,
  benyttet: false,
  bruktTilMinstEnVurdering: false,
  datert,
  duplikatAvId: '',
  duplikater: [],
  fremhevet: false,
  id,
  links: [
    {
      versjon: '1',
      rel: LinkRel.DOKUMENT_INNHOLD,
      type: 'GET',
      href: '/dokumenter/' + id,
    },
  ],
  mottattDato: datert,
  mottattTidspunkt: datert + 'T10:00:00',
  navn: id + '.pdf',
  type: Dokumenttype.LEGEERKLÆRING,
});

const dokument = lagDokument('dokument-1', '2024-01-15');

const lagStandardverdier = (): VurderingAvLivetsSluttfaseFormState => ({
  vurderingAvLivetsSluttfase: '',
  erILivetsSluttfase: undefined,
  perioder: [new Period('2024-01-01', '2024-01-31')],
  dokumenter: [],
});

const meta: Meta<typeof VurderingAvLivetsSluttfaseForm> = {
  title: 'fakta/fakta-medisinsk-vilkår/VurderingAvLivetsSluttfaseForm',
  component: VurderingAvLivetsSluttfaseForm,
  args: {
    defaultValues: lagStandardverdier(),
    onSubmit: fn(),
    onAvbryt: fn(),
    isSubmitting: false,
    perioderSomKanVurderes: [new Period('2024-01-01', '2024-01-31')],
    resterendeVurderingsperioder: [new Period('2024-01-01', '2024-01-31')],
    dokumenter: [dokument],
  },
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
};

export default meta;
type Story = StoryObj<typeof VurderingAvLivetsSluttfaseForm>;

export const ILivetsSluttfase: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Fyll ut og bekreft at den pleietrengende er i livets sluttfase', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Sykehus/spesialist. 15.01.2024' }));
      await userEvent.type(
        canvas.getByRole('textbox', { name: /Gjør en vurdering/ }),
        'Den pleietrengende er i livets sluttfase.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: 'Ja' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      });
      await expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          resultat: Vurderingsresultat.OPPFYLT,
          tekst: 'Den pleietrengende er i livets sluttfase.',
          dokumenter: [expect.objectContaining({ id: dokument.id })],
          perioder: [expect.objectContaining({ fom: '2024-01-01', tom: '2024-01-31' })],
        }),
      );
    });
  },
};

export const IkkeILivetsSluttfase: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Fyll ut og bekreft at den pleietrengende ikke er i livets sluttfase', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Sykehus/spesialist. 15.01.2024' }));
      await userEvent.type(
        canvas.getByRole('textbox', { name: /Gjør en vurdering/ }),
        'Den pleietrengende er ikke i livets sluttfase.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      });
      await expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          resultat: Vurderingsresultat.IKKE_OPPFYLT,
          tekst: 'Den pleietrengende er ikke i livets sluttfase.',
          dokumenter: [expect.objectContaining({ id: dokument.id })],
          perioder: [expect.objectContaining({ fom: '2024-01-01', tom: '2024-01-31' })],
        }),
      );
    });
  },
};

export const PåkrevdeFelt: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Vis valideringsfeil når påkrevde felt er tomme', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Du må ha brukt ett eller flere dokumenter i vurderingen')).toBeInTheDocument();
        await expect(canvas.getAllByText('Du må oppgi en verdi')).toHaveLength(2);
      });
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};

export const PeriodeUtenforSøknadsperioden: Story = {
  args: {
    onSubmit: fn(),
    defaultValues: {
      vurderingAvLivetsSluttfase: 'Den pleietrengende er i livets sluttfase.',
      erILivetsSluttfase: Vurderingsresultat.OPPFYLT,
      perioder: [new Period('2024-02-01', '2024-02-15')],
      dokumenter: [dokument.id],
    },
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Vis feilmelding for periode utenfor søknadsperioden', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await expect(
        canvas.getByText('Perioden som vurderes må være innenfor en eller flere sammenhengede søknadsperioder'),
      ).toBeInTheDocument();
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};

export const IkkeVurdertAllePeriodene: Story = {
  args: {
    resterendeVurderingsperioder: [new Period('2024-01-01', '2024-02-15')],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Vis varsel når ikke alle periodene er vurdert', async () => {
      await expect(canvas.getByText(/Du har ikke vurdert alle periodene som må vurderes/)).toBeInTheDocument();
    });
  },
};

export const AllePeriodeneVurdert: Story = {
  args: {
    resterendeVurderingsperioder: [new Period('2024-01-01', '2024-01-31')],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Ikke vis varsel når alle periodene er vurdert', async () => {
      await expect(canvas.queryByText(/Du har ikke vurdert alle periodene som må vurderes/)).not.toBeInTheDocument();
    });
  },
};

export const KunLesetilgang: Story = {
  parameters: {
    readOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Skjul bekreftknappen i lesetilgang', async () => {
      await expect(canvas.queryByRole('button', { name: 'Bekreft' })).not.toBeInTheDocument();
    });
  },
};
