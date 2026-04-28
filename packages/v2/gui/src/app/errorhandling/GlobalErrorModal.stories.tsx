import { withContentBelowStory, withTopDekoratør } from '../../storybook/decorators/withTopDekoratør.js';
import { type Decorator, type Meta, type StoryObj } from '@storybook/react-vite';
import { GlobalUnhandledErrorCatcher } from './GlobalUnhandledErrorCatcher.js';
import { GlobalErrorModal } from './GlobalErrorModal.js';
import { expect, userEvent, within } from 'storybook/test';

const errMsg = 'Test error ';

const withGlobalUnhandledErrorCatcher =
  ({ maxErrorCount }: { maxErrorCount: number } = { maxErrorCount: 10 }): Decorator =>
  Story => {
    return (
      <>
        <GlobalUnhandledErrorCatcher maxErrorCount={maxErrorCount}>
          <Story />
          <p>
            <button
              onClick={() => {
                throw new Error(errMsg + Date.now());
              }}
            >
              Throw error
            </button>
          </p>
        </GlobalUnhandledErrorCatcher>
      </>
    );
  };

const meta = {
  title: 'gui/app/errorhandling/GlobalErrorModal',
  component: GlobalErrorModal,
  parameters: {
    layout: 'fullscreen',
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  decorators: [withTopDekoratør(), withGlobalUnhandledErrorCatcher(), withContentBelowStory()],
} satisfies Meta<typeof GlobalErrorModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoError: Story = {};

export const ThrowError: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Throw error' }));
    const dialog = await within(document.body).findByRole('alertdialog');
    await expect(dialog).toBeInTheDocument();
    await expect(within(dialog).getByText('Uventet feil', { exact: false })).toBeInTheDocument();
    await expect(within(dialog).getByText(errMsg, { exact: false })).toBeInTheDocument();
  },
};
