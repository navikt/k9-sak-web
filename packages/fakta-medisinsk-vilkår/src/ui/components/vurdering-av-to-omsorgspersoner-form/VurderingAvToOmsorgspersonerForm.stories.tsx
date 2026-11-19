import React from 'react';
import { Period } from '@fpsak-frontend/utils';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import LinkRel from '../../../constants/LinkRel';
import type Dokument from '../../../types/Dokument';
import { Dokumenttype } from '../../../types/Dokument';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import ContainerContext from '../../context/ContainerContext';
import VurderingAvToOmsorgspersonerForm, {
  type VurderingAvToOmsorgspersonerFormState,
} from './VurderingAvToOmsorgspersonerForm';

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

const lagStandardverdier = (): VurderingAvToOmsorgspersonerFormState => ({
  vurderingAvToOmsorgspersoner: '',
  harBehovForToOmsorgspersoner: undefined,
  perioder: [new Period('2024-01-01', '2024-01-31')],
  dokumenter: [],
});

const meta: Meta<typeof VurderingAvToOmsorgspersonerForm> = {
  title: 'fakta/fakta-medisinsk-vilkår/VurderingAvToOmsorgspersonerForm',
  component: VurderingAvToOmsorgspersonerForm,
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
type Story = StoryObj<typeof VurderingAvToOmsorgspersonerForm>;

export const BehovForToOmsorgspersoner: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Fyll ut og bekreft behov for to omsorgspersoner', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Sykehus/spesialist. 15.01.2024' }));
      await userEvent.type(
        canvas.getByRole('textbox', { name: /Gjør en vurdering/ }),
        'Det er behov for to omsorgspersoner samtidig.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: 'Ja' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      });
      await expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          resultat: Vurderingsresultat.OPPFYLT,
          tekst: 'Det er behov for to omsorgspersoner samtidig.',
          dokumenter: [expect.objectContaining({ id: dokument.id })],
          perioder: [expect.objectContaining({ fom: '2024-01-01', tom: '2024-01-31' })],
        }),
      );
    });
  },
};

export const IkkeBehovForToOmsorgspersoner: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Fyll ut og bekreft at det ikke er behov for to omsorgspersoner', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Sykehus/spesialist. 15.01.2024' }));
      await userEvent.type(
        canvas.getByRole('textbox', { name: /Gjør en vurdering/ }),
        'Det er ikke behov for to omsorgspersoner samtidig.',
      );
      await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      });
      await expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          resultat: Vurderingsresultat.IKKE_OPPFYLT,
          tekst: 'Det er ikke behov for to omsorgspersoner samtidig.',
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

export const PeriodeUtenforPeriodeMedTilsynsbehov: Story = {
  args: {
    onSubmit: fn(),
    defaultValues: {
      vurderingAvToOmsorgspersoner: 'Det er behov for to omsorgspersoner samtidig.',
      harBehovForToOmsorgspersoner: true,
      perioder: [new Period('2024-02-01', '2024-02-15')],
      dokumenter: [dokument.id],
    },
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Vis feilmelding for periode utenfor perioder med tilsynsbehov', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await expect(
        await canvas.findByText(
          'Perioden som vurderes må være innenfor en eller flere sammenhengede perioder med behov for kontinuerlig tilsyn og pleie',
        ),
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Ikke vis varsel når alle periodene er vurdert', async () => {
      await expect(canvas.queryByText(/Du har ikke vurdert alle periodene som må vurderes/)).not.toBeInTheDocument();
    });
  },
};

export const MangeDokumenter: Story = {
  args: {
    dokumenter: [
      lagDokument('dokument-1', '2024-01-15'),
      lagDokument('dokument-2', '2024-01-16'),
      lagDokument('dokument-3', '2024-01-17'),
      lagDokument('dokument-4', '2024-01-18'),
      lagDokument('dokument-5', '2024-01-19'),
      lagDokument('dokument-6', '2024-01-20'),
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const dokumentgruppe = canvas.getByRole('group', {
      name: 'Hvilke dokumenter er brukt i vurderingen av to omsorgspersoner?',
    });
    await step('Vis fem dokumenter og åpne hele dokumentlisten', async () => {
      await expect(within(dokumentgruppe).getAllByRole('checkbox')).toHaveLength(5);
      await userEvent.click(canvas.getByRole('button', { name: 'Vis alle dokumenter (6)' }));
      await expect(within(dokumentgruppe).getAllByRole('checkbox')).toHaveLength(6);
      await expect(canvas.getByRole('button', { name: 'Vis færre dokumenter' })).toBeInTheDocument();
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
