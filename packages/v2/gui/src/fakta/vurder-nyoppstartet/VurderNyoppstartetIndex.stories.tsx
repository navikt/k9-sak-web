import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { VurderNyoppstartetIndex } from './VurderNyoppstartetIndex';

const meta = {
  title: 'gui/fakta/vurder-nyoppstartet/VurderNyoppstartetIndex',
  component: VurderNyoppstartetIndex,
} satisfies Meta<typeof VurderNyoppstartetIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    submitCallback: fn(),
    harApneAksjonspunkter: true,
    aksjonspunkter: [],
    behandlingUUID: '1',
    readOnly: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/k9/sak/api/behandling/nyoppstartet', async () => {
          return HttpResponse.json({}, { status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvas, args, step }) => {
    await step('Skal sende inn nyoppstartet dato', async () => {
      await waitFor(() => expect(canvas.getByText('Ja')).toBeInTheDocument());
      await userEvent.click(canvas.getByLabelText('Ja'));
      await userEvent.type(canvas.getByLabelText('Dato for nyoppstartet'), '2023-01-01');
      await userEvent.type(canvas.getByLabelText('Begrunnelse'), 'Dette er en begrunnelse');
      await userEvent.click(canvas.getByText('Bekreft'));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      await expect(args.submitCallback).toHaveBeenCalledWith([
        {
          begrunnelse: 'Dette er en begrunnelse',
          kode: '9016',
          avklarNyoppstartet: {
            erNyoppstartet: true,
            fom: '2023-01-01',
          },
        },
      ]);
    });
  },
  render: props => <VurderNyoppstartetIndex {...props} />,
};
