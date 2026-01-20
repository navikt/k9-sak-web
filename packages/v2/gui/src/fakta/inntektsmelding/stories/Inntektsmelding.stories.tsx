import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import inntektsmeldingPropsMock, {
  aksjonspunkt9071FerdigProps,
  aksjonspunkt9071Props,
} from '../mock/inntektsmeldingPropsMock.js';
import ferdigvisning, {
  alleErMottatt,
  ikkePaakrevd,
  ikkePaakrevdOgManglerInntektsmelding,
  manglerFlereInntektsmeldinger,
  manglerInntektsmelding,
} from '../mock/mockedKompletthetsdata.js';
import { withFakeInntektsmeldingApi } from '../mock/withFakeInntektsmeldingApi.js';
import InntektsmeldingIndex, { type InntektsmeldingContainerProps } from '../ui/InntektsmeldingIndex.js';
import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';

const createProps = (
  behandlingUuid: string,
  props: Partial<InntektsmeldingContainerProps>,
): InntektsmeldingContainerProps => ({
  ...inntektsmeldingPropsMock,
  submitCallback: action('submitCallback'),
  ...props,
  behandling: {
    uuid: behandlingUuid,
    opprettet: new Date(),
    sakstype: 'SAK',
    status: 'FERDIG',
    type: 'BEHANDLING',
    versjon: 1,
  } as unknown as BehandlingDto,
});

const meta: Meta<typeof InntektsmeldingIndex> = {
  title: 'gui/fakta/inntektsmelding',
  component: InntektsmeldingIndex,
};

export default meta;

type Story = StoryObj<typeof InntektsmeldingIndex>;

export const IkkePaakrevd: Story = {
  args: createProps(ikkePaakrevd.behandlingUuid, {}),
  decorators: [withFakeInntektsmeldingApi(ikkePaakrevd.behandlingUuid, ikkePaakrevd.vurdering)],
};

export const Mangler9069: Story = {
  args: createProps(manglerInntektsmelding.behandlingUuid, {}),
  decorators: [withFakeInntektsmeldingApi(manglerInntektsmelding.behandlingUuid, manglerInntektsmelding.vurdering)],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Venter på at komponenten er lastet', async () => {
      await waitFor(() => expect(canvas.getByText(/Når kan du gå videre uten inntektsmelding?/i)).toBeInTheDocument());
    });

    await step('Sjekker at knapp ikke vises når beslutning ikke er valgt', async () => {
      const radioOption = await canvas.findByLabelText(/Nei, send purring med varsel om avslag/i);
      await expect(radioOption).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).not.toBeInTheDocument();
      await expect(
        canvas.queryByRole('button', { name: /Send purring med varsel om avslag/i }),
      ).not.toBeInTheDocument();
    });

    await step('Viser riktig knapp når purring er valgt', async () => {
      const radioOption = await canvas.findByLabelText(/Nei, send purring med varsel om avslag/i);
      await user.click(radioOption);
      await waitFor(async () => {
        await expect(canvas.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).not.toBeInTheDocument();
        await expect(canvas.getByRole('button', { name: /Send purring med varsel om avslag/i })).toBeInTheDocument();
      });
    });

    await step('Må skrive begrunnelse når man har valgt A-inntekt', async () => {
      // Velg A-inntekt radio
      const aInntektRadio = await canvas.findByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i);
      await user.click(aInntektRadio);
      // Vent på at knappen vises
      const submitButton = await canvas.findByRole('button', { name: /Fortsett uten inntektsmelding/i });
      // Prøv å submitte uten begrunnelse
      await user.click(submitButton);
      await waitFor(async () => {
        await expect(canvas.getByText('Du må fylle inn en verdi')).toBeInTheDocument();
      });
    });

    await step('Kan submitte begrunnelse når man har valgt A-inntekt', async () => {
      // Velg A-inntekt radio på nytt (reset fra forrige step)
      const aInntektRadio = await canvas.findByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i);
      await user.click(aInntektRadio);
      // Vent på at begrunnelse-feltet vises
      const begrunnelseField = await canvas.findByLabelText(/Begrunnelse/i);
      await user.type(begrunnelseField, 'Inntektsmelding? LOL! Nei takk');
      // Vent på at submit-knappen vises og klikk
      const submitButton = await canvas.findByRole('button', { name: /Fortsett uten inntektsmelding/i });
      await user.click(submitButton);
    });
  },
};

export const Mangler9071: Story = {
  args: createProps(manglerInntektsmelding.behandlingUuid, aksjonspunkt9071Props),
  decorators: [withFakeInntektsmeldingApi(manglerInntektsmelding.behandlingUuid, manglerInntektsmelding.vurdering)],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Venter på at komponenten er lastet', async () => {
      await waitFor(() => expect(canvas.getByText(/Når kan du gå videre uten inntektsmelding?/i)).toBeInTheDocument());
    });

    await step('Sjekker at knapp ikke vises når beslutning ikke er valgt', async () => {
      const radioOption = await canvas.findByLabelText(
        /Nei, avslå på grunn av manglende opplysninger om inntekt etter §21-3/i,
      );
      await expect(radioOption).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).not.toBeInTheDocument();
      await expect(
        canvas.queryByRole('button', { name: /Send purring med varsel om avslag/i }),
      ).not.toBeInTheDocument();
    });

    await step('Viser riktig knapp når purring er valgt', async () => {
      const radioOption = await canvas.findByLabelText(
        /Nei, avslå på grunn av manglende opplysninger om inntekt etter §21-3/i,
      );
      await user.click(radioOption);
      await waitFor(async () => {
        await expect(canvas.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).not.toBeInTheDocument();
        await expect(canvas.getByRole('button', { name: /Avslå Periode/i })).toBeInTheDocument();
      });
    });

    await step('Må skrive begrunnelse når man har valgt A-inntekt', async () => {
      // Velg A-inntekt radio
      const aInntektRadio = await canvas.findByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i);
      await user.click(aInntektRadio);
      // Vent på at knappen vises
      const submitButton = await canvas.findByRole('button', { name: /Fortsett uten inntektsmelding/i });
      // Prøv å submitte uten begrunnelse
      await user.click(submitButton);
      await waitFor(async () => {
        await expect(canvas.getByText('Du må fylle inn en verdi')).toBeInTheDocument();
      });
    });

    await step('Kan submitte begrunnelse når man har valgt A-inntekt', async () => {
      // Velg A-inntekt radio på nytt (reset fra forrige step)
      const aInntektRadio = await canvas.findByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i);
      await user.click(aInntektRadio);
      // Vent på at begrunnelse-feltet vises
      const begrunnelseField = await canvas.findByLabelText(/Begrunnelse/i);
      await user.type(begrunnelseField, 'Inntektsmelding? LOL! Nei takk');
      // Vent på at submit-knappen vises og klikk
      const submitButton = await canvas.findByRole('button', { name: /Fortsett uten inntektsmelding/i });
      await user.click(submitButton);
    });
  },
};

export const ManglerFlere9071: Story = {
  args: createProps(manglerFlereInntektsmeldinger.behandlingUuid, aksjonspunkt9071Props),
  decorators: [
    withFakeInntektsmeldingApi(manglerFlereInntektsmeldinger.behandlingUuid, manglerFlereInntektsmeldinger.vurdering),
  ],
};

export const IkkePaakrevdOgMangler9071: Story = {
  args: createProps(ikkePaakrevdOgManglerInntektsmelding.behandlingUuid, {}),
  decorators: [
    withFakeInntektsmeldingApi(
      ikkePaakrevdOgManglerInntektsmelding.behandlingUuid,
      ikkePaakrevdOgManglerInntektsmelding.vurdering,
    ),
  ],
};

export const FerdigVisning9069: Story = {
  args: createProps(ferdigvisning.behandlingUuid, {}),
  decorators: [withFakeInntektsmeldingApi(ferdigvisning.behandlingUuid, ferdigvisning.vurdering)],
};

export const FerdigVisning9071: Story = {
  args: createProps(ferdigvisning.behandlingUuid, aksjonspunkt9071FerdigProps),
  decorators: [withFakeInntektsmeldingApi(ferdigvisning.behandlingUuid, ferdigvisning.vurdering)],
};

export const AlleInntektsmeldingerMottatt: Story = {
  args: createProps(alleErMottatt.behandlingUuid, aksjonspunkt9071Props),
  decorators: [withFakeInntektsmeldingApi(alleErMottatt.behandlingUuid, alleErMottatt.vurdering)],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Venter på at komponenten er lastet', async () => {
      await waitFor(() => expect(canvas.getByText(/Når kan du gå videre uten inntektsmelding?/i)).toBeInTheDocument());
    });

    await step(
      'Hvis det tidligere er blitt gjort en vurdering og behandlingen har hoppet tilbake må man kunne løse aksjonspunktet',
      async () => {
        const sendInnButton = await canvas.findByRole('button', { name: /Send inn/i });
        await user.click(sendInnButton);
      },
    );
  },
};
