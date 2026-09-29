import { OmPleietrengendeApiContext } from '@k9-sak-web/gui/fakta/om-pleietrengende/api/OmPleietrengendeApiContext.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { IntlProvider } from 'react-intl';
import { expect, userEvent } from 'storybook/test';
import messages from '../../../i18n/nb_NO.json';
import OmPleietrengendeFaktaIndex from '@k9-sak-web/gui/fakta/om-pleietrengende/OmPleietrengendeFaktaIndex.js';
import OmPleietrengende from '../../components/OmPleietrengende';
import OmPleietrengendeFaktaPanelDef from './OmPleietrengendeFaktaPanelDef';

// Kompileringsfeil her betyr at BRUK_V2_OM_PLEIETRENGENDE er fjernet fra FeatureToggles.
// Slett denne fila når v1-grenen i OmPleietrengendeFaktaPanelDef fjernes.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_OM_PLEIETRENGENDE'];

const pleietrengende = {
  aktoerId: '1234567890123',
  fnr: '12345678910',
  navn: 'Ola Nordmann',
};

const PanelMedVersjonsvelger = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <IntlProvider locale="nb" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <OmPleietrengendeApiContext value={{ hentPleietrengende: async () => pleietrengende }}>
          <Suspense>
            {new OmPleietrengendeFaktaPanelDef().getKomponent({
              featureToggles: { BRUK_V2_OM_PLEIETRENGENDE: true },
              behandling: { uuid: 'test-behandling-uuid' },
              omPleietrengende: { navn: pleietrengende.navn, fnr: pleietrengende.fnr },
            })}
          </Suspense>
        </OmPleietrengendeApiContext>
      </QueryClientProvider>
    </IntlProvider>
  );
};

const meta = {
  title: 'behandling/pleiepenger-sluttfase/fakta/OmPleietrengendeFaktaPanelDef',
  component: PanelMedVersjonsvelger,
} satisfies Meta<typeof PanelMedVersjonsvelger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SammenlignV1OgV2: Story = {
  play: async ({ canvas, step }) => {
    await step('Ny versjon vises som standard', async () => {
      await expect(await canvas.findByText('Ola Nordmann')).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Ny versjon' })).toBeChecked();
    });
    await step('Gammel versjon viser samme data', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Gammel versjon' }));
      await expect(canvas.getByText('Ola Nordmann')).toBeInTheDocument();
      await expect(canvas.getByText('12345678910')).toBeInTheDocument();
    });
  },
};

export const V1OgV2SideOmSide: Story = {
  render: () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return (
      <IntlProvider locale="nb" messages={messages}>
        <QueryClientProvider client={queryClient}>
          <OmPleietrengendeApiContext value={{ hentPleietrengende: async () => pleietrengende }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <section aria-label="v1">
                <OmPleietrengende omPleietrengende={{ navn: pleietrengende.navn, fnr: pleietrengende.fnr }} />
              </section>
              <section aria-label="v2">
                <Suspense>
                  <OmPleietrengendeFaktaIndex behandlingUuid="test-behandling-uuid" />
                </Suspense>
              </section>
            </div>
          </OmPleietrengendeApiContext>
        </QueryClientProvider>
      </IntlProvider>
    );
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findAllByText('Ola Nordmann')).toHaveLength(2);
  },
};
