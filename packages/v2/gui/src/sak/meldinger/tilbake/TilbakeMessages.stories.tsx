import type { Meta, StoryObj } from '@storybook/react-vite';

import type { BrevmalDto } from '@k9-sak-web/backend/combined/tilbakekreving/dokumentbestilling/BrevmalDto.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { foreldrepenger_tilbakekreving_behandlingslager_behandling_BehandlingType as BehandlingType } from '@k9-sak-web/backend/k9tilbake/generated/types.ts';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import { FakeTilbakeMeldingerApi } from '@k9-sak-web/gui/storybook/mocks/FakeTilbakeMeldingerApi.js';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, within } from 'storybook/test';
import { StickyStateReducer } from '../../../utils/StickyStateReducer.js';
import { TilbakeMessages, type TilbakeMessagesProps } from './TilbakeMessages.js';

const newStickyState = (): TilbakeMessagesProps['stickyState'] => ({
  valgtMalkode: new StickyStateReducer(),
  fritekst: {
    tekst: new StickyStateReducer(),
    tittel: new StickyStateReducer(),
  },
});

const testMaler: BrevmalDto[] = [
  {
    kode: 'VARSEL',
    navn: 'Varsel om tilbakebetaling',
    tilgjengelig: true,
  },
  {
    kode: 'VEDTAK',
    navn: 'Vedtak om tilbakebetaling',
    tilgjengelig: true,
  },
  {
    kode: 'HENLEGGELSE',
    navn: 'Henleggelsesbrev',
    tilgjengelig: false,
  },
];

const api = new FakeTilbakeMeldingerApi();
const meta = {
  title: 'gui/sak/meldinger/tilbake/TilbakeMessages.tsx',
  component: TilbakeMessages,
  decorators: [withMaxWidth(420)],
  beforeEach: () => {
    api.reset();
  },
} satisfies Meta<typeof TilbakeMessages>;
export default meta;

const elemsfinder = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  return {
    canvas,
    malEl: () => canvas.getByLabelText('Mal'),
    fritekstEl: () => canvas.getByLabelText('Fritekst', { exact: false }),
    sendBrevBtn: () => canvas.getByRole('button', { name: 'Send brev' }),
    forhåndsvisBtn: () => canvas.getByRole('button', { name: 'Forhåndsvis' }),
  };
};

type Story = StoryObj<typeof meta>;
export const DefaultStory: Story = {
  args: {
    fagsak: {
      saksnummer: '100',
      sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
      status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'FAGSAK_STATUS' },
      person: {
        aktørId: 'person-aktørid-1',
      },
    },
    behandling: {
      id: 101,
      uuid: 'XUYPS4',
      type: { kode: BehandlingType.TILBAKEKREVING, kodeverk: 'BEHANDLING_TYPE' },
      språkkode: {
        kode: 'NB',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    maler: testMaler,
    api,
    onMessageSent: fn(() => action('onMessageSent')),
    stickyState: newStickyState(),
  },
  play: async ({ canvasElement, step }) => {
    const { malEl, fritekstEl, sendBrevBtn, forhåndsvisBtn } = elemsfinder(canvasElement);
    await step('Sjekk visning basert på initiell default state', async () => {
      await expect(malEl()).toBeInTheDocument();
      await expect(fritekstEl()).toBeInTheDocument();
      await expect(sendBrevBtn()).toBeInTheDocument();
      await expect(forhåndsvisBtn()).toBeInTheDocument();
    });
    await step('Valgt mal skal være første tilgjengelige mal', async () => {
      await expect(malEl()).toHaveValue('VARSEL');
    });
  },
};

export const MalValg: Story = {
  args: {
    ...DefaultStory.args,
    stickyState: newStickyState(),
  },
  play: async ({ canvasElement, step }) => {
    const { malEl } = elemsfinder(canvasElement);
    await userEvent.click(canvasElement);
    await step('Bytte mal skal oppdatere valgt mal', async () => {
      await userEvent.selectOptions(malEl(), 'VEDTAK');
      await expect(malEl()).toHaveValue('VEDTAK');
    });
    await step('Bytter tilbake til første mal', async () => {
      await userEvent.selectOptions(malEl(), 'VARSEL');
      await expect(malEl()).toHaveValue('VARSEL');
    });
  },
};

export const SendBrev: Story = {
  args: {
    ...DefaultStory.args,
    stickyState: newStickyState(),
  },
  play: async ({ canvasElement, step }) => {
    api.fakeDelayMillis = 0;
    const { fritekstEl, sendBrevBtn } = elemsfinder(canvasElement);
    const dummyText = 'Dette er en test av sending av brev';
    await userEvent.click(canvasElement);
    await step('Fyll inn fritekst og send brev', async () => {
      api.resetSisteFakeDokumentBestilling();
      await userEvent.type(fritekstEl(), dummyText);
      await userEvent.click(sendBrevBtn());

      await expect(api.sisteFakeDokumentBestilling?.fritekst).toEqual(dummyText);
      await expect(api.sisteFakeDokumentBestilling?.brevmalkode).toEqual('VARSEL');
    });
    api.fakeDelayMillis = 800;
  },
};

export const Forhåndsvisning: Story = {
  args: {
    ...DefaultStory.args,
    stickyState: newStickyState(),
  },
  play: async ({ canvasElement, step }) => {
    api.fakeDelayMillis = 0;
    const { fritekstEl, forhåndsvisBtn } = elemsfinder(canvasElement);
    const dummyText = 'Test tekst for forhåndsvisning';
    await userEvent.click(canvasElement);
    await step('Fyll inn fritekst og forhåndsvis', async () => {
      await userEvent.type(fritekstEl(), dummyText);
      // Note: We can't fully test window.open in Storybook, but we can verify the button is clickable
      await expect(forhåndsvisBtn()).toBeEnabled();
    });
    api.fakeDelayMillis = 800;
  },
};

export const Validering: Story = {
  args: {
    ...DefaultStory.args,
    stickyState: newStickyState(),
  },
  play: async ({ canvasElement, step }) => {
    api.fakeDelayMillis = 0;
    const { fritekstEl, sendBrevBtn } = elemsfinder(canvasElement);
    await userEvent.click(canvasElement);
    await step('Forsøk å sende brev uten fritekst skal gi valideringsfeil', async () => {
      api.resetSisteFakeDokumentBestilling();
      await userEvent.click(sendBrevBtn());

      // Fritekst skal være invalid
      await expect(fritekstEl()).toBeInvalid();
      // Bestilling skal ikke ha gått gjennom
      await expect(api.sisteFakeDokumentBestilling).toBeUndefined();
    });
    api.fakeDelayMillis = 800;
  },
};
