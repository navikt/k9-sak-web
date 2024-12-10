import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor } from '@storybook/test';
import { VurderNyoppstartet } from './VurderNyoppstartet';

const meta: Meta<typeof VurderNyoppstartet> = {
  title: 'gui/prosess/vurder-nyoppstartet/VurderNyoppstartet',
  component: VurderNyoppstartet,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    submitCallback: fn(),
  },
  play: async ({ canvas, args, step }) => {
    step('Skal sende inn nyoppstartet dato', async () => {
      await userEvent.click(canvas.getByLabelText('Ja'));
      await userEvent.type(canvas.getByLabelText('Dato for nyoppstartet'), '2023-01-01');
      await userEvent.type(canvas.getByLabelText('Begrunnelse'), 'Dette er en begrunnelse');
      await userEvent.click(canvas.getByText('Bekreft'));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      expect(args.submitCallback).toHaveBeenCalledWith({
        begrunnelse: 'Dette er en begrunnelse',
        erNyoppstartet: true,
        kode: '9016',
        nyoppstartetFom: '2023-01-01',
        fortsettBehandling: true,
      });
    });
  },
  render: props => <VurderNyoppstartet {...props} />,
};
