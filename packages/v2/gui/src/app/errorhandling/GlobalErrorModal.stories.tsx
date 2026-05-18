import { withContentBelowStory, withTopDekoratør } from '../../storybook/decorators/withTopDekoratør.js';
import { type Decorator, type Meta, type StoryObj } from '@storybook/react-vite';
import { GlobalUnhandledErrorCatcher } from './GlobalUnhandledErrorCatcher.js';
import { GlobalErrorModal } from './GlobalErrorModal.js';
import { expect, userEvent, within } from 'storybook/test';
import { BodyShort, Button, Dialog } from '@navikt/ds-react';
import { AppError } from './AppError.js';

const errMsg = 'Test error';

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
                throw new AppError({ title: 'Uventet feil', message: errMsg });
              }}
            >
              Throw error
            </button>
          </p>
          <p>
            <label htmlFor="test-input">Test input: </label>
            <input type="text" id="test-input" />
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

export const InputValueRemainsAfterError: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Test input:' });
    await userEvent.type(input, 'Test input data');
    await userEvent.click(canvas.getByRole('button', { name: 'Throw error' }));
    const dialog = await within(document.body).findByRole('alertdialog');
    await expect(dialog).toBeInTheDocument();
    await expect(input).toHaveValue('Test input data');
    // Lukk dialogen
    await userEvent.click(within(dialog).getByRole('button', { name: 'Lukk' }));
    // Sjekk at inputverdien framleis er intakt etter at dialogen er lukka
    await expect(input).toHaveValue('Test input data');
  },
};

/**
 * Viser GlobalErrorModal som dukkar opp medan ein annan dialog allereie er open.
 * Simulerer eit scenario der brukar jobbar i ein dialog og ein uhandtert feil oppstår.
 */
export const ErrorWhileDialogOpen: Story = {
  decorators: [
    Story => (
      <>
        <Dialog open>
          <Dialog.Popup width="medium">
            <Dialog.Header>
              <Dialog.Title>Registrer opplysningar</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <BodyShort>Dette er ein dummy-dialog som simulerer ein aktiv arbeidsflyt.</BodyShort>
              <Button
                variant="secondary-neutral"
                onClick={() => {
                  throw new Error(errMsg);
                }}
              >
                Utløys feil
              </Button>
            </Dialog.Body>
          </Dialog.Popup>
        </Dialog>
        <Story />
      </>
    ),
  ],
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Utløys feil' }));
    const alertDialog = await within(document.body).findByRole('alertdialog');
    await expect(alertDialog).toBeInTheDocument();
    await expect(alertDialog).toBeVisible();
    await expect(within(alertDialog).getAllByText(errMsg, { exact: false }).length).toBeGreaterThanOrEqual(2);
  },
};
