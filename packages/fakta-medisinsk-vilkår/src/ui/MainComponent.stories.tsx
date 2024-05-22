/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import React, { useEffect } from 'react';
import { handlers } from '../../mock/handlers';
import BehandlingType from '../constants/BehandlingType';
import FagsakYtelseType from '../constants/FagsakYtelseType';
import MainComponent from './MainComponent';

const meta: Meta<typeof MainComponent> = {
  title: 'fakta/fakta-medisinsk-vilkår',
  component: MainComponent,
  args: {
    data: {
      endpoints: {
        vurderingsoversiktKontinuerligTilsynOgPleie:
          'http://localhost:8082/mock/kontinuerlig-tilsyn-og-pleie/vurderingsoversikt',
        vurderingsoversiktBehovForToOmsorgspersoner: 'http://localhost:8082/mock/to-omsorgspersoner/vurderingsoversikt',
        dokumentoversikt: 'http://localhost:8082/mock/dokumentoversikt',
        dataTilVurdering: 'http://localhost:8082/mock/data-til-vurdering',
        innleggelsesperioder: 'http://localhost:8082/mock/innleggelsesperioder',
        diagnosekoder: 'http://localhost:8082/mock/diagnosekoder',
        status: 'http://localhost:8082/mock/status',
        nyeDokumenter: 'http://localhost:8082/mock/nye-dokumenter',
        vurderingsoversiktLivetsSluttfase: 'http://localhost:8082/mock/livets-sluttfase/vurderingsoversikt',
      },
      behandlingUuid: '123',
      readOnly: false,
      onFinished: () => console.log('Aksjonspunkt løst'),
      visFortsettknapp: true,
      fagsakYtelseType: FagsakYtelseType.PLEIEPENGER,
      behandlingType: BehandlingType.FORSTEGANGSSOKNAD,
      httpErrorHandler: undefined,
    },
  },
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  decorators: [
    Story => {
      useEffect(() => () => window.location.reload(), []);
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof MainComponent>;

export const MedisinskVilkår: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal kunne håndtere dokumentasjon av sykdom', async () => {
      await waitFor(async () => {
        await expect(canvas.getByText('Ja, legeerklæring fra sykehus/spesialisthelsetjenesten')).toBeInTheDocument();
      });

      await userEvent.click(canvas.getByLabelText('Ja, legeerklæring fra sykehus/spesialisthelsetjenesten'));
      await userEvent.type(canvas.getByText('Hvilken dato er dokumentet datert?'), '101021');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
    });

    await step('skal kunne legge inn innleggelsesperioder', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Rediger liste' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Legg til innleggelsesperiode' }));
      await userEvent.type(canvas.getAllByRole('textbox', { name: 'Fra' })[3], '101021');
      await userEvent.type(canvas.getAllByRole('textbox', { name: 'Til' })[3], '300123');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Fortsett' }));
    });

    await step('skal kunne håndtere tilsyn og pleie', async () => {
      await waitFor(async () => {
        await expect(
          canvas.getAllByText('Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?')[0],
        ).toBeInTheDocument();
      });
      await userEvent.click(canvas.getByText('Sykehus/spesialist. 16.01.2020'));
      await userEvent.type(canvas.getAllByRole('textbox')[0], 'test');
      await userEvent.click(canvas.getByLabelText('Ja'));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Overlappende periode')).toBeInTheDocument();
      });
      await userEvent.click(canvas.getAllByRole('button', { name: 'Bekreft' })[1]);
      await waitFor(async () => {
        await expect(canvas.getByText('Eventuelle endringer er registrert')).toBeInTheDocument();
      });
      await userEvent.click(canvas.getByRole('button', { name: 'Eventuelle endringer er registrert' }));
    });

    await step('skal kunne håndtere to omsorgspersoner', async () => {
      await waitFor(async () => {
        await expect(
          canvas.getAllByText('Hvilke dokumenter er brukt i vurderingen av to omsorgspersoner?')[0],
        ).toBeInTheDocument();
      });
      await userEvent.click(canvas.getByText('Sykehus/spesialist. 16.01.2020'));
      await userEvent.type(canvas.getAllByRole('textbox')[0], 'test');
      await userEvent.click(canvas.getByLabelText('Ja'));
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Overlappende periode')).toBeInTheDocument();
      });
      await userEvent.click(canvas.getAllByRole('button', { name: 'Bekreft' })[1]);
    });
  },
};

MedisinskVilkår.parameters = {
  msw: {
    handlers,
  },
};
