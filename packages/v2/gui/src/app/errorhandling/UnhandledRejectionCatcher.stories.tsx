import { UnhandledRejectionCatcher } from './UnhandledRejectionCatcher.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMutation } from '@tanstack/react-query';
import withFeatureToggles from '../../storybook/decorators/withFeatureToggles.js';
import { expect, userEvent } from 'storybook/test';

const meta = {
  title: 'gui/app/errorhandling/UnhandledRejectionCatcher',
  component: UnhandledRejectionCatcher,
  decorators: [withFeatureToggles({ VIS_ALLE_ASYNC_ERRORS: true })],
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
} satisfies Meta<typeof UnhandledRejectionCatcher>;

export default meta;

type Story = StoryObj<typeof meta>;

const FailingMutationChild = () => {
  const simulatedMutation = useMutation({
    mutationFn: async () => {
      throw new Error('BOOM');
    },
  });
  return (
    <>
      <form>
        <input type="text" />
        <button type="button" onClick={() => simulatedMutation.mutate()}>
          Trigger mutation fail
        </button>
      </form>
    </>
  );
};

export const MutationFailureDefaultUnhandled: Story = {
  render: () => {
    return (
      <>
        <UnhandledRejectionCatcher />
        <FailingMutationChild />
      </>
    );
  },
  play: async ({ canvas, step }) => {
    await step('user types something in input', async () => {
      await userEvent.type(canvas.getByRole('textbox'), 'userinput');
    });
    await step('user submits, request triggers error', async () => {
      await userEvent.click(canvas.getByRole('button'));
      expect(canvas.getByText('Bakgrunnsprosess feilet', { exact: false }));
    });
    await step('input should still have typed value at this point (not be re-rendered)', async () => {
      await expect(canvas.getByRole('textbox')).toHaveValue('userinput');
    });
  },
};
