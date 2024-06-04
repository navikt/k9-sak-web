/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { handlers } from '../../mock/api-mock';
import { mockUrlPrepend } from '../../mock/constants';
import MainComponent from './MainComponent';

const meta: Meta<typeof MainComponent> = {
  title: 'fakta/fakta-etablert-tilsyn',
  component: MainComponent,
  args: {
    data: {
      readOnly: false,
      endpoints: {
        tilsyn: `${mockUrlPrepend}/mock/tilsyn`,
        sykdom: `${mockUrlPrepend}/mock/sykdom`,
        sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
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
  },
};

EtablertTilsyn.parameters = {
  msw: {
    handlers,
  },
};
