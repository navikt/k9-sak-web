import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import { DelingAvDagerApiContext } from '@k9-sak-web/gui/fakta/deling-av-dager/api/DelingAvDagerApiContext.js';
import { Behandling } from '@k9-sak-web/types';
import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import UttakFaktaPanelDef from './UttakFaktaPanelDef';

// @ts-expect-error Migrert frå ts-ignore
const behandling: Behandling = {
  id: 1,
  versjon: 1,
  uuid: 'test-behandling-uuid',
};

const panelDef = new UttakFaktaPanelDef();
const featureToggles = { BRUK_V2_DELING_AV_DAGER: true };

const fårRammevedtakV1 = (type: RammevedtakType, lengde: string): Rammevedtak => ({
  type,
  lengde,
  avsender: '02028920544',
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
});

const girRammevedtakV1 = (type: RammevedtakType, lengde: string): Rammevedtak => ({
  type,
  lengde,
  mottaker: '02028920544',
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
});

const fårRammevedtakV2 = (
  type: 'OverføringFår' | 'FordelingFår' | 'KoronaOverføringFår',
  lengde: string,
): RammevedtakDto => ({
  type,
  lengde,
  avsender: '02028920544',
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
});

const girRammevedtakV2 = (
  type: 'OverføringGir' | 'FordelingGir' | 'KoronaOverføringGir',
  lengde: string,
): RammevedtakDto => ({
  type,
  lengde,
  mottaker: '02028920544',
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
});

const withFakeApiV2 = (rammevedtak: RammevedtakDto[]): Decorator => {
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

const meta = {
  title: 'omsorgspenger/fakta/UttakFaktaPanelDef (v1 vs v2)',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const MedOverføringerOgFordelinger: Story = {
  decorators: [
    withFakeApiV2([
      fårRammevedtakV2('OverføringFår', 'P4D'),
      fårRammevedtakV2('OverføringFår', 'P7D'),
      fårRammevedtakV2('KoronaOverføringFår', 'P3D'),
      girRammevedtakV2('OverføringGir', 'P8D'),
      girRammevedtakV2('FordelingGir', 'P1D'),
      girRammevedtakV2('KoronaOverføringGir', 'P2D'),
      girRammevedtakV2('FordelingGir', 'P4D'),
    ]),
  ],
  render: () =>
    panelDef.getKomponent({
      behandling,
      featureToggles,
      rammevedtak: [
        fårRammevedtakV1(RammevedtakEnum.OVERFØRING_FÅR, 'P4D'),
        fårRammevedtakV1(RammevedtakEnum.OVERFØRING_FÅR, 'P7D'),
        fårRammevedtakV1(RammevedtakEnum.KORONAOVERFØRING_FÅR, 'P3D'),
        girRammevedtakV1(RammevedtakEnum.OVERFØRING_GIR, 'P8D'),
        girRammevedtakV1(RammevedtakEnum.FORDELING_GIR, 'P1D'),
        girRammevedtakV1(RammevedtakEnum.KORONAOVERFØRING_GIR, 'P2D'),
        girRammevedtakV1(RammevedtakEnum.FORDELING_GIR, 'P4D'),
      ],
    }),
};

export const KunDagerSøkerFår: Story = {
  decorators: [
    withFakeApiV2([
      fårRammevedtakV2('OverføringFår', 'P13D'),
      fårRammevedtakV2('KoronaOverføringFår', 'P5D'),
      fårRammevedtakV2('FordelingFår', 'P3D'),
    ]),
  ],
  render: () =>
    panelDef.getKomponent({
      behandling,
      featureToggles,
      rammevedtak: [
        fårRammevedtakV1(RammevedtakEnum.OVERFØRING_FÅR, 'P13D'),
        fårRammevedtakV1(RammevedtakEnum.KORONAOVERFØRING_FÅR, 'P5D'),
        fårRammevedtakV1(RammevedtakEnum.FORDELING_FÅR, 'P3D'),
      ],
    }),
};

export const IngenOverføringer: Story = {
  decorators: [withFakeApiV2([])],
  render: () => panelDef.getKomponent({ behandling, featureToggles, rammevedtak: [] }),
};

// Kompileringsfeil her betyr at BRUK_V2_DELING_AV_DAGER er fjernet fra FeatureToggles.
// Slett sammenligningsstoryen når versjonsvelgeren fjernes.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DELING_AV_DAGER'];
