import { userEvent } from 'storybook/test';
import { AvregningProsessIndex } from './AvregningProsessIndex';
import { sjekkHøyEtterbetalingMock, vurderFeilutbetalingMock } from './AvregningMocks';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FakeBehandlingAvregningBackendApi } from '../../storybook/mocks/FakeBehandlingAvregningBackendApi';
import { AvregningFormProvider } from '../../context/AvregningContext';

const fakeAvregningBackendClient = new FakeBehandlingAvregningBackendApi();

const meta = {
  title: 'gui/prosess/avregning/prosess-avregning',
  decorators: [
    Story => (
      <AvregningFormProvider behandlingId={1}>
        <Story />
      </AvregningFormProvider>
    ),
  ],
  component: AvregningProsessIndex,
} satisfies Meta<typeof AvregningProsessIndex>;

type Story = StoryObj<typeof meta>;
export const AksjonspunktVurderFeilutbetaling8084 = () => (
  <AvregningProsessIndex {...vurderFeilutbetalingMock} client={fakeAvregningBackendClient} />
);

export const FyllAksjonspunktVurderFeilutbetaling8084: Story = {
  args: { ...vurderFeilutbetalingMock, client: fakeAvregningBackendClient },

  play: async ({ canvas }) => {
    const begrunnelse = canvas.getByRole('textbox', {
      name: 'Forklar hva feilutbetalingen skyldes og valget av videre behandling',
    });
    await userEvent.click(begrunnelse);
    await userEvent.type(begrunnelse, 'Arbeidsgiver har oppgitt for lav inntekt i inntektsmelding');
    await userEvent.click(canvas.getByText('Opprett tilbakekreving, send varsel'));
    const fritekst = canvas.getByRole('textbox', { name: 'Fritekst i varselet' });
    await userEvent.click(fritekst);
    await userEvent.type(fritekst, 'vi skal ha tilbake penga våre!!{enter}{enter}hilsen nav');

    //TODO: Når bruken av window.location.reload() er fjernet kan vi teste at bekreftAksjonspunktVurderFeilutbetaling blir kalt

    // await userEvent.click(canvas.getByText('Bekreft og fortsett'));
    // await expect(fakeAvregningBackendClient.bekreftAksjonspunktVurderFeilutbetaling).toHaveBeenCalledOnce();
  },
};

export const AksjonspunktHøyEtterbetaling8086 = () => (
  <AvregningProsessIndex {...sjekkHøyEtterbetalingMock} client={fakeAvregningBackendClient} />
);

export const FyllAksjonspunktHøyEtterbetaling8086: Story = {
  args: { ...sjekkHøyEtterbetalingMock, client: fakeAvregningBackendClient },

  play: async ({ canvas }) => {
    const begrunnelse = canvas.getByRole('textbox', {
      name: 'Begrunn hvorfor du går videre med denne behandlingen.',
    });
    await userEvent.click(begrunnelse);
    await userEvent.type(begrunnelse, 'Nye inntektsopplysninger tilsier at søker har krav på etterbetalingen');

    //TODO: Når bruken av window.location.reload() er fjernet kan vi teste at bekreftAksjonspunktSjekkHøyEtterbetaling blir kalt

    // await userEvent.click(canvas.getByText('Bekreft og fortsett'));
    // await expect(fakeAvregningBackendClient.bekreftAksjonspunktSjekkHøyEtterbetaling).toHaveBeenCalledOnce();
  },
};
export default meta;
