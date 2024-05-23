/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import React, { useEffect } from 'react';
import { handlers } from '../../mock/api-mock';
import MainComponent from './MainComponent';

const meta: Meta<typeof MainComponent> = {
  title: 'fakta/fakta-etablert-tilsyn',
  component: MainComponent,
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: 'http://localhost:8082/mock/tilsyn',
        sykdom: 'http://localhost:8082/mock/sykdom',
        sykdomInnleggelse: 'http://localhost:8082/mock/sykdomInnleggelse',
      },
      httpErrorHandler: undefined,
      lagreBeredskapvurdering: undefined,
      lagreNattevåkvurdering: undefined,
      harAksjonspunktForBeredskap: true,
      harAksjonspunktForNattevåk: true,
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

export const EtablertTilsyn: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('skal ha skjema for håndtering av beredskap', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Beredskap' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Vurdering av beredskap')).toBeInTheDocument();
      });
      await userEvent.type(
        canvas.getByRole('textbox', {
          name: 'Gjør en vurdering av om det er behov for beredskap etter § 9-11, tredje ledd.',
        }),
        'test',
      );
      await expect(canvas.queryByLabelText('Fra')).not.toBeInTheDocument();
      await expect(canvas.queryByLabelText('Til')).not.toBeInTheDocument();
      await userEvent.click(canvas.getByText('Ja, i deler av perioden'));
      await expect(canvas.getByLabelText('Fra')).toBeInTheDocument();
      await expect(canvas.getByLabelText('Til')).toBeInTheDocument();
    });

    await step('skal ha skjema for håndtering av nattevåk', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Nattevåk' }));
      await waitFor(async () => {
        await expect(canvas.getByText('Vurdering av nattevåk')).toBeInTheDocument();
      });
      await userEvent.type(
        canvas.getByRole('textbox', {
          name: 'Gjør en vurdering av om det er behov for nattevåk etter § 9-11, tredje ledd.',
        }),
        'test',
      );
      await expect(canvas.queryByLabelText('Fra')).not.toBeInTheDocument();
      await expect(canvas.queryByLabelText('Til')).not.toBeInTheDocument();
      await userEvent.click(canvas.getByText('Ja, i deler av perioden'));
      await expect(canvas.getByLabelText('Fra')).toBeInTheDocument();
      await expect(canvas.getByLabelText('Til')).toBeInTheDocument();
    });

    // await step('skal kunne legge inn innleggelsesperioder', async () => {
    //   await userEvent.click(canvas.getByRole('button', { name: 'Rediger liste' }));
    //   await userEvent.click(canvas.getByRole('button', { name: 'Legg til innleggelsesperiode' }));
    //   await userEvent.type(canvas.getAllByRole('textbox', { name: 'Fra' })[3], '101021');
    //   await userEvent.type(canvas.getAllByRole('textbox', { name: 'Til' })[3], '300123');
    //   await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
    //   await userEvent.click(canvas.getByRole('button', { name: 'Fortsett' }));
    // });

    // await step('skal kunne håndtere tilsyn og pleie', async () => {
    //   await waitFor(async () => {
    //     await expect(
    //       canvas.getAllByText('Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?')[0],
    //     ).toBeInTheDocument();
    //   });
    //   await userEvent.click(canvas.getByText('Sykehus/spesialist. 16.01.2020'));
    //   await userEvent.type(canvas.getAllByRole('textbox')[0], 'test');
    //   await userEvent.click(canvas.getByLabelText('Ja'));
    //   await userEvent.clear(canvas.getByRole('textbox', { name: 'til' }));
    //   await userEvent.type(canvas.getByRole('textbox', { name: 'til' }), '020322');
    //   await userEvent.click(canvas.getByRole('textbox', { name: 'fra' }));
    //   await expect(canvas.getByText('Du har valgt en dato som er utenfor gyldig periode.')).toBeInTheDocument();
    //   await userEvent.clear(canvas.getByRole('textbox', { name: 'til' }));
    //   await userEvent.type(canvas.getByRole('textbox', { name: 'til' }), '280222');
    //   await userEvent.click(canvas.getByRole('textbox', { name: 'fra' }));
    //   await expect(canvas.queryByText('Du har valgt en dato som er utenfor gyldig periode.')).not.toBeInTheDocument();
    //   await expect(
    //     canvas.getByText(
    //       'Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du etter at du har lagret denne.',
    //     ),
    //   ).toBeInTheDocument();
    //   await userEvent.clear(canvas.getByRole('textbox', { name: 'til' }));
    //   await userEvent.type(canvas.getByRole('textbox', { name: 'til' }), '010322');
    //   await userEvent.click(canvas.getByRole('textbox', { name: 'fra' }));
    //   await expect(
    //     canvas.queryByText(
    //       'Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du etter at du har lagret denne.',
    //     ),
    //   ).not.toBeInTheDocument();
    //   await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
    //   await waitFor(async () => {
    //     await expect(canvas.getByText('Overlappende periode')).toBeInTheDocument();
    //   });
    //   await userEvent.click(canvas.getAllByRole('button', { name: 'Bekreft' })[1]);
    //   await waitFor(async () => {
    //     await expect(canvas.getByText('Eventuelle endringer er registrert')).toBeInTheDocument();
    //   });
    //   await userEvent.click(canvas.getByRole('button', { name: 'Eventuelle endringer er registrert' }));
    // });

    // await step('skal kunne håndtere to omsorgspersoner', async () => {
    //   await waitFor(async () => {
    //     await expect(
    //       canvas.getAllByText('Hvilke dokumenter er brukt i vurderingen av to omsorgspersoner?')[0],
    //     ).toBeInTheDocument();
    //   });
    //   await userEvent.click(canvas.getByText('Sykehus/spesialist. 16.01.2020'));
    //   await userEvent.type(canvas.getAllByRole('textbox')[0], 'test');
    //   await userEvent.click(canvas.getByLabelText('Ja'));
    //   await userEvent.click(canvas.getByRole('button', { name: 'Bekreft' }));
    //   await waitFor(async () => {
    //     await expect(canvas.getByText('Overlappende periode')).toBeInTheDocument();
    //   });
    //   await userEvent.click(canvas.getAllByRole('button', { name: 'Bekreft' })[1]);
    //   await waitFor(async () => {
    //     await expect(
    //       canvas.getByText('Sykdom er ferdig vurdert og du kan gå videre i behandlingen.'),
    //     ).toBeInTheDocument();
    //   });
    // });
  },
};

EtablertTilsyn.parameters = {
  msw: {
    handlers,
  },
};
