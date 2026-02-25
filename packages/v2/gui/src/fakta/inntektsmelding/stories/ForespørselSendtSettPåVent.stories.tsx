import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import { Dialog } from '@navikt/ds-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs from 'dayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { expect, userEvent } from 'storybook/test';
import { InntektsmeldingApiContext } from '../api/InntektsmeldingApiContext.js';
import InntektsmeldingContext from '../context/InntektsmeldingContext.js';
import type { InntektsmeldingContextType } from '../types.js';
import { ForespørselSendtSettPåVent } from '../ui/components/NyInntektsmeldingDialog/ForespørselSendtSettPåVent.js';

const queryClient = new QueryClient();

const contextValue: InntektsmeldingContextType = {
  behandling: {
    id: 1,
    versjon: 1,
    uuid: 'test-behandling-uuid',
  } as BehandlingDto,
  readOnly: false,
  arbeidsforhold: {},
  dokumenter: [],
  onFinished: () => undefined,
  aksjonspunkter: [],
};

const apiValue = {
  hentKompletthetsoversikt: async () => ({ tilstand: [] }),
  etterspørInntektsmelding: async () => undefined,
  settPåVent: async () => undefined,
};

const StoryComponent = () => (
  <QueryClientProvider client={queryClient}>
    <InntektsmeldingApiContext value={apiValue}>
      <InntektsmeldingContext.Provider value={contextValue}>
        <Dialog open>
          <Dialog.Popup>
            <ForespørselSendtSettPåVent />
          </Dialog.Popup>
        </Dialog>
      </InntektsmeldingContext.Provider>
    </InntektsmeldingApiContext>
  </QueryClientProvider>
);

const meta = {
  title: 'gui/fakta/inntektsmelding/ForespørselSendtSettPåVent',
  component: StoryComponent,
} satisfies Meta<typeof StoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ViserFeilVedFristOver14Dager: Story = {
  play: async ({ canvas }) => {
    const user = userEvent.setup();
    const fristInput = await canvas.findByRole('textbox', { name: 'Frist' });
    const forSenDato = dayjs().add(15, 'day').format('DD.MM.YYYY');

    await user.clear(fristInput);
    await user.type(fristInput, forSenDato);
    await user.tab();
    await user.click(await canvas.findByRole('button', { name: 'Sett på vent' }));

    await expect(canvas.getByText(/Maks frist er/i)).toBeInTheDocument();
  },
};
