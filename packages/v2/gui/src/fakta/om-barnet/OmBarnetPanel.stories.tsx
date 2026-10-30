import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { RettVedDødType } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/RettVedDødType.js';
import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { OmBarnetPanel } from './OmBarnetPanel.js';
import { rett12UkerTekst, rett6UkerTekst } from './rettVedDødUtfallTekst.js';

const pleietrengende = {
  navn: 'Kari Nordmann',
  fnr: '01011912345',
  diagnosekoder: ['NA08', 'DA09'],
  dodsdato: '2025-03-14',
} satisfies PersonopplysningPleietrengendeDto;

const lagretVurdering = {
  rettVedDødType: RettVedDødType.RETT_6_UKER,
  vurdering: 'Søker har mottatt pleiepenger i under tre år.',
  vurdertAv: 'Z123456',
  vurdertTidspunkt: '2025-04-02T10:15:00',
} satisfies VurderingRettPleiepengerVedDødDto;

const aksjonspunkt = (vurdering: string, rettVedDødType: RettVedDødType) => ({
  kode: AksjonspunktDefinisjon.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD,
  begrunnelse: 'Rett etter pleietrengendes død er behandlet',
  vurdering,
  rettVedDødType,
});

const meta = {
  title: 'gui/fakta/om-barnet/OmBarnetPanel',
  component: OmBarnetPanel,
  args: {
    pleietrengende,
    rettVedDød: null,
    readOnly: false,
    submittable: true,
    bekreftRettVedDød: fn(async () => {}),
  },
} satisfies Meta<typeof OmBarnetPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NyVurdering: Story = {
  play: async ({ canvas, args, step }) => {
    await step('Viser opplysninger om barnet og tomt skjema', async () => {
      await expect(canvas.getByRole('heading', { name: 'Om barnet' })).toBeInTheDocument();
      await expect(canvas.getByText('Kari Nordmann')).toBeInTheDocument();
      await expect(canvas.getByText('01011912345')).toBeInTheDocument();
      await expect(canvas.getByText('NA08, DA09')).toBeInTheDocument();
      await expect(canvas.getByText('Død 14.03.2025')).toBeInTheDocument();
      await expect(canvas.getByRole('heading', { name: 'Rett til pleiepenger ved barnets død' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: rett6UkerTekst })).not.toBeChecked();
      await expect(canvas.getByRole('radio', { name: rett12UkerTekst })).not.toBeChecked();
      await expect(canvas.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('');
      await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    });

    await step('Krever valgt utfall og vurdering med innhold', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(canvas.getAllByText('Feltet må fylles ut')).toHaveLength(2));

      await userEvent.click(canvas.getByRole('radio', { name: rett6UkerTekst }));
      await userEvent.type(canvas.getByRole('textbox', { name: 'Vurdering' }), '   ');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(canvas.getByText('Feltet må fylles ut')).toBeInTheDocument());
      await expect(args.bekreftRettVedDød).not.toHaveBeenCalled();
    });

    await step('Sender vurdering med rett til 6 uker', async () => {
      const vurdering = canvas.getByRole('textbox', { name: 'Vurdering' });
      await userEvent.clear(vurdering);
      await userEvent.type(vurdering, 'Mindre enn tre år med pleiepenger.');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.bekreftRettVedDød).toHaveBeenCalledTimes(1));
      await expect(args.bekreftRettVedDød).toHaveBeenNthCalledWith(
        1,
        aksjonspunkt('Mindre enn tre år med pleiepenger.', RettVedDødType.RETT_6_UKER),
      );
    });

    await step('Sender vurdering med rett til 12 uker', async () => {
      const vurdering = canvas.getByRole('textbox', { name: 'Vurdering' });
      await userEvent.click(canvas.getByRole('radio', { name: rett12UkerTekst }));
      await userEvent.clear(vurdering);
      await userEvent.type(vurdering, 'Tre år eller mer med full pleiepenger.');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.bekreftRettVedDød).toHaveBeenCalledTimes(2));
      await expect(args.bekreftRettVedDød).toHaveBeenNthCalledWith(
        2,
        aksjonspunkt('Tre år eller mer med full pleiepenger.', RettVedDødType.RETT_12_UKER),
      );
    });

    await step('Avbryt tilbakestiller skjemaet uten å sende inn', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Avbryt' }));
      await expect(canvas.getByRole('radio', { name: rett12UkerTekst })).not.toBeChecked();
      await expect(canvas.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('');
      await expect(args.bekreftRettVedDød).toHaveBeenCalledTimes(2);
    });
  },
};

export const VurderingensMaksimaleLengde: Story = {
  play: async ({ canvas, args, step }) => {
    const vurdering = canvas.getByRole('textbox', { name: 'Vurdering' });

    await step('Avviser vurdering på 4097 tegn', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: rett6UkerTekst }));
      await userEvent.click(vurdering);
      await userEvent.paste('a'.repeat(4097));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(canvas.getAllByText('Du kan skrive maksimalt 4096 tegn').length).toBeGreaterThan(0));
      await expect(args.bekreftRettVedDød).not.toHaveBeenCalled();
    });

    await step('Godtar vurdering på 4096 tegn', async () => {
      await userEvent.clear(vurdering);
      await userEvent.paste('a'.repeat(4096));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.bekreftRettVedDød).toHaveBeenCalledTimes(1));
      await expect(args.bekreftRettVedDød).toHaveBeenCalledWith(
        aksjonspunkt('a'.repeat(4096), RettVedDødType.RETT_6_UKER),
      );
    });
  },
};

export const BarnUtenDiagnoserOgDødsdato: Story = {
  args: {
    pleietrengende: { navn: 'Kari Nordmann', fnr: '01011912345', diagnosekoder: [] },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Kari Nordmann')).toBeInTheDocument();
    await expect(canvas.queryByText(/Diagnose:/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Død /)).not.toBeInTheDocument();
  },
};

export const BarnUtenOpplysninger: Story = {
  args: {
    pleietrengende: {},
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Om barnet' })).toBeInTheDocument();
    await expect(canvas.queryByText(/Navn:/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Fødselsnummer:/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Diagnose:/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Død /)).not.toBeInTheDocument();
  },
};

export const ManglerOpplysningerOmBarnet: Story = {
  args: {
    pleietrengende: null,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Om barnet' })).toBeInTheDocument();
    await expect(canvas.getByText('Ingen opplysninger om barnet.')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'Rett til pleiepenger ved barnets død' })).toBeInTheDocument();
    await expect(canvas.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
  },
};

export const LagretVurdering: Story = {
  args: { rettVedDød: lagretVurdering },
  play: async ({ canvas, args, step }) => {
    await step('Viser lagret vurdering med utfall og hvem som vurderte', async () => {
      await expect(canvas.getByText(rett6UkerTekst)).toBeInTheDocument();
      await expect(canvas.getByText('Søker har mottatt pleiepenger i under tre år.')).toBeInTheDocument();
      await expect(canvas.getByText('Vurdering av Z123456, 02.04.2025')).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    });

    await step('Avbryt forkaster endringer, og nytt skjema starter fra lagret vurdering', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Rediger vurdering' }));
      await userEvent.click(canvas.getByRole('radio', { name: rett12UkerTekst }));
      await userEvent.type(canvas.getByRole('textbox', { name: 'Vurdering' }), ' Forkastet tillegg.');
      await userEvent.click(canvas.getByRole('button', { name: 'Avbryt' }));

      await expect(canvas.getByText(rett6UkerTekst)).toBeInTheDocument();
      await expect(canvas.queryByText(rett12UkerTekst)).not.toBeInTheDocument();

      await userEvent.click(canvas.getByRole('button', { name: 'Rediger vurdering' }));
      await expect(canvas.getByRole('radio', { name: rett6UkerTekst })).toBeChecked();
      await expect(canvas.getByRole('textbox', { name: 'Vurdering' })).toHaveValue(lagretVurdering.vurdering);
      await expect(args.bekreftRettVedDød).not.toHaveBeenCalled();
    });

    await step('Sender endret vurdering', async () => {
      const vurdering = canvas.getByRole('textbox', { name: 'Vurdering' });
      await userEvent.click(canvas.getByRole('radio', { name: rett12UkerTekst }));
      await userEvent.clear(vurdering);
      await userEvent.type(vurdering, 'Endret vurdering.');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.bekreftRettVedDød).toHaveBeenCalledTimes(1));
      await expect(args.bekreftRettVedDød).toHaveBeenCalledWith(
        aksjonspunkt('Endret vurdering.', RettVedDødType.RETT_12_UKER),
      );
    });
  },
};

export const LagretVurderingUtenMetadata: Story = {
  args: {
    rettVedDød: { rettVedDødType: RettVedDødType.RETT_12_UKER, vurdering: 'Søker har mottatt full pleiepenger.' },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(rett12UkerTekst)).toBeInTheDocument();
    await expect(canvas.getByText('Søker har mottatt full pleiepenger.')).toBeInTheDocument();
    await expect(canvas.queryByText(/Vurdering av/)).not.toBeInTheDocument();
  },
};

export const LagretVurderingUtenKjentUtfall: Story = {
  args: { rettVedDød: { vurdering: 'Vurdering uten valgt utfall.' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Vurdering uten valgt utfall.')).toBeInTheDocument();
    await expect(canvas.queryByText(rett6UkerTekst)).not.toBeInTheDocument();
    await expect(canvas.queryByText(rett12UkerTekst)).not.toBeInTheDocument();
  },
};

export const SkrivebeskyttetUtenVurdering: Story = {
  args: { readOnly: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Kari Nordmann')).toBeInTheDocument();
    await expect(
      canvas.queryByRole('heading', { name: 'Rett til pleiepenger ved barnets død' }),
    ).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const SkrivebeskyttetMedVurdering: Story = {
  args: { readOnly: true, rettVedDød: lagretVurdering },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Rett til pleiepenger ved barnets død' })).toBeInTheDocument();
    await expect(canvas.getByText(rett6UkerTekst)).toBeInTheDocument();
    await expect(canvas.getByText(lagretVurdering.vurdering)).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const InnsendingIkkeTillatt: Story = {
  args: { submittable: false },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('radio', { name: rett6UkerTekst }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Vurdering' }), 'Vurdering.');
    await expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    await expect(args.bekreftRettVedDød).not.toHaveBeenCalled();
  },
};

export const InnsendingSomFeilerOgForsøkesPåNytt: Story = {
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  play: async ({ canvas, args, step }) => {
    let avvis: (feil: Error) => void = () => {};
    args.bekreftRettVedDød.mockImplementationOnce(
      () =>
        new Promise<void>((_, reject) => {
          avvis = reject;
        }),
    );

    await step('Låser knappene mens innsendingen pågår', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: rett6UkerTekst }));
      await userEvent.type(canvas.getByRole('textbox', { name: 'Vurdering' }), 'Beholdes ved feil.');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));

      // Knappen får lasteindikator mens innsendingen pågår, så vi finner knappene uten navn
      const knapper = await waitFor(async () => {
        const alleKnapper = canvas.getAllByRole('button');
        await expect(alleKnapper).toHaveLength(2);
        for (const knapp of alleKnapper) {
          await expect(knapp).toBeDisabled();
        }
        return alleKnapper;
      });
      for (const knapp of knapper) {
        await userEvent.click(knapp);
      }
      await expect(args.bekreftRettVedDød).toHaveBeenCalledTimes(1);
    });

    await step('Beholder input når innsendingen avvises', async () => {
      avvis(new Error('Lagring feilet'));
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeEnabled());
      await expect(canvas.getByRole('radio', { name: rett6UkerTekst })).toBeChecked();
      await expect(canvas.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('Beholdes ved feil.');
    });

    await step('Tillater nytt forsøk', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.bekreftRettVedDød).toHaveBeenCalledTimes(2));
      await expect(args.bekreftRettVedDød).toHaveBeenLastCalledWith(
        aksjonspunkt('Beholdes ved feil.', RettVedDødType.RETT_6_UKER),
      );
    });
  },
};
