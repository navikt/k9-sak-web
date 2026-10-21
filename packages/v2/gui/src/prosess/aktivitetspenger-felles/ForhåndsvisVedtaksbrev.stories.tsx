import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { behandlingType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/ungsak/kodeverk/FagsakYtelsesType.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VedtaksbrevValgResponse } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/VedtaksbrevValgResponse.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, spyOn, userEvent, waitFor } from 'storybook/test';
import { withQueryClientProvider } from '../../storybook/decorators/withQueryClientProvider.js';
import { FakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi.js';
import { ForhåndsvisVedtaksbrev } from './ForhåndsvisVedtaksbrev.js';

const behandling = {
  behandlingAnsvarlige: {},
  id: 123,
  opprettet: '2026-01-01T00:00:00',
  sakstype: fagsakYtelsesType.UNGDOMSYTELSE,
  status: BehandlingStatus.OPPRETTET,
  type: behandlingType.FØRSTEGANGSSØKNAD,
  uuid: 'story-behandling',
  versjon: 1,
} satisfies BehandlingDto;

const innvilgelse = {
  kilde: 'INNVILGELSE',
  kode: 'INNVILGELSE',
  kodeverk: 'DOKUMENT_MAL_TYPE',
  navn: 'Innvilgelse',
} satisfies NonNullable<NonNullable<VedtaksbrevValgResponse['vedtaksbrevValg']>[number]['dokumentMalType']>;

const apiMedVedtaksbrev = (response: VedtaksbrevValgResponse) => {
  const api = new FakeAktivitetspengerApi();
  api.vedtaksbrevValg = fn(async () => response);
  api.forhåndsvisVedtaksbrev = fn(async () => new Blob());
  return api;
};

const apiMedEttBrev = apiMedVedtaksbrev({
  harBrev: true,
  vedtaksbrevValg: [{ dokumentMalType: innvilgelse }],
});

const apiUtenBrev = apiMedVedtaksbrev({
  harBrev: false,
  vedtaksbrevValg: [{ dokumentMalType: innvilgelse }],
});

const apiMedHentefeil = new FakeAktivitetspengerApi();
apiMedHentefeil.vedtaksbrevValg = fn(async () => {
  throw new Error('Henting av vedtaksbrev feilet');
});

const apiMedForhåndsvisningsfeil = apiMedVedtaksbrev({
  harBrev: true,
  vedtaksbrevValg: [{ dokumentMalType: innvilgelse }],
});
apiMedForhåndsvisningsfeil.forhåndsvisVedtaksbrev = fn(async () => {
  throw new Error('Forhåndsvisning feilet');
});

const mockWindowOpen = (popupBlokkert: boolean) => () => {
  const windowOpenSpy = spyOn(window, 'open').mockReturnValue(popupBlokkert ? null : window);
  return () => windowOpenSpy.mockRestore();
};

const meta = {
  title: 'gui/prosess/aktivitetspenger-felles/ForhåndsvisVedtaksbrev',
  component: ForhåndsvisVedtaksbrev,
  decorators: [
    withQueryClientProvider({
      queries: { throwOnError: false },
      mutations: { onError: () => {} },
    }),
  ],
} satisfies Meta<typeof ForhåndsvisVedtaksbrev>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EttBrev: Story = {
  args: { api: apiMedEttBrev, behandling },
  beforeEach: mockWindowOpen(false),
  play: async ({ canvas, args }) => {
    const knapp = await canvas.findByRole('button', { name: 'Forhåndsvis brev' });
    await userEvent.click(knapp);
    await expect(args.api.forhåndsvisVedtaksbrev).toHaveBeenCalledWith(behandling.id, innvilgelse.kilde);
    await expect(window.open).toHaveBeenCalledWith(expect.any(String), '_blank');
  },
};

export const IngenBrev: Story = {
  args: { api: apiUtenBrev, behandling },
  beforeEach: mockWindowOpen(false),
  play: async ({ canvas, args }) => {
    await waitFor(() => expect(args.api.vedtaksbrevValg).toHaveBeenCalledWith(behandling.id));
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const HentingFeiler: Story = {
  args: { api: apiMedHentefeil, behandling },
  beforeEach: mockWindowOpen(false),
  play: async ({ canvas }) => {
    await canvas.findByText('Kunne ikke hente vedtaksbrev for forhåndsvisning.');
  },
};

export const PopupBlokkert: Story = {
  args: { api: apiMedEttBrev, behandling },
  beforeEach: mockWindowOpen(true),
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Forhåndsvis brev' }));
    await canvas.findByText(
      'Nettleseren blokkerte forhåndsvisningen. Tillat popup-vinduer for denne siden og prøv igjen.',
    );
  },
};

export const ForhåndsvisningFeiler: Story = {
  args: { api: apiMedForhåndsvisningsfeil, behandling },
  beforeEach: mockWindowOpen(false),
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Forhåndsvis brev' }));
    await canvas.findByText('Forhåndsvisning feilet');
  },
};
