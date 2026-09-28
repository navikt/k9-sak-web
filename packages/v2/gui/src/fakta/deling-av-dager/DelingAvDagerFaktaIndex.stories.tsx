import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { DelingAvDagerApiContext } from './api/DelingAvDagerApiContext.js';
import DelingAvDagerFaktaIndex from './DelingAvDagerFaktaIndex.js';

const withFakeApi = (rammevedtak: RammevedtakDto[]): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <DelingAvDagerApiContext value={{ hentRammevedtak: async () => rammevedtak }}>
        <Suspense>
          <Story />
        </Suspense>
      </DelingAvDagerApiContext>
    </QueryClientProvider>
  );
};

const fårRammevedtak = (
  type: 'OverføringFår' | 'FordelingFår' | 'KoronaOverføringFår',
  lengde: string,
): RammevedtakDto => ({
  type,
  lengde,
  avsender: '02028920544',
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
});

const girRammevedtak = (
  type: 'OverføringGir' | 'FordelingGir' | 'KoronaOverføringGir',
  lengde: string,
): RammevedtakDto => ({
  type,
  lengde,
  mottaker: '02028920544',
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
});

const meta = {
  title: 'gui/fakta/deling-av-dager/DelingAvDagerFaktaIndex',
  component: DelingAvDagerFaktaIndex,
  args: {
    behandlingUuid: 'test-behandling-uuid',
  },
} satisfies Meta<typeof DelingAvDagerFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MedOverføringerOgFordelinger: Story = {
  decorators: [
    withFakeApi([
      fårRammevedtak('OverføringFår', 'P4D'),
      fårRammevedtak('OverføringFår', 'P7D'),
      fårRammevedtak('KoronaOverføringFår', 'P3D'),
      girRammevedtak('OverføringGir', 'P8D'),
      girRammevedtak('FordelingGir', 'P1D'),
      girRammevedtak('KoronaOverføringGir', 'P2D'),
      girRammevedtak('FordelingGir', 'P4D'),
    ]),
  ],
  play: async ({ canvas, step }) => {
    await step('Viser totalt antall dager per type og retning', async () => {
      await expect(await canvas.findByText('Får 11 dager')).toBeVisible();
      await expect(canvas.getByText('Gir 5 dager')).toBeVisible();
      await expect(canvas.getByText('Gir 8 dager')).toBeVisible();
    });
    await step('Viser enkeltoverføringer når raden utvides', async () => {
      const rad = canvas.getByText('Får 11 dager').closest('tr')!;
      await userEvent.click(within(rad).getByRole('button'));
      const detaljer = within(rad.nextElementSibling as HTMLElement);
      await expect(await detaljer.findByText('4')).toBeVisible();
      await expect(detaljer.getByText('7')).toBeVisible();
      await expect(detaljer.getAllByText('01.01.2020 - 31.12.2020')).toHaveLength(2);
    });
  },
};

export const KunDagerSøkerFår: Story = {
  decorators: [
    withFakeApi([
      fårRammevedtak('OverføringFår', 'P13D'),
      fårRammevedtak('KoronaOverføringFår', 'P5D'),
      fårRammevedtak('FordelingFår', 'P3D'),
    ]),
  ],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Får 13 dager')).toBeVisible();
    await expect(canvas.getAllByText('Gir 0 dager')).toHaveLength(3);
  },
};

export const IngenOverføringer: Story = {
  decorators: [withFakeApi([])],
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByText('Det er ikke registrert noen overføringer eller fordelinger av dager.'),
    ).toBeVisible();
  },
};
