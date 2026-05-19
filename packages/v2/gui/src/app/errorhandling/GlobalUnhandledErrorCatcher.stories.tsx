import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import {
  GlobalUnhandledErrorCatcher,
  type GlobalUnhandledErrorCatcherProps,
  useGlobalUnhandledErrors,
} from './GlobalUnhandledErrorCatcher.js';
import { useMutation } from '@tanstack/react-query';
import { withTopDekoratør } from '../../storybook/decorators/withTopDekoratør.js';
import { TopErrorPanel } from './ui/TopErrorPanel.js';
import withErrorBoundary from '../../storybook/decorators/withErrorBoundary.js';
import { BodyShort, Button, Dialog } from '@navikt/ds-react';

interface ErrorThrowingComponentProps {
  readonly foreverThrowInRender?: boolean;
}

type ErrorHandlingDemoAppProps = ErrorThrowingComponentProps & Omit<GlobalUnhandledErrorCatcherProps, 'children'>;

const InRenderErrorThrowingComponent = ({ foreverThrowInRender }: ErrorThrowingComponentProps) => {
  const [shallRenderThrow, triggerRenderThrow] = useState(foreverThrowInRender ?? false);
  const throwError = () => {
    throw new Error('Simple in-render error');
  };
  return (
    <p>
      In render error-throwing component. {shallRenderThrow ? throwError() : null}
      <button onClick={() => triggerRenderThrow(true)}>Throw render error</button>
    </p>
  );
};

const NormalErrorThrowingComponent = () => {
  const throwError = () => {
    throw new Error('Normal error');
  };
  return (
    <p>
      Normal error-throwing component. <button onClick={throwError}>Throw error</button>
    </p>
  );
};

const InAsyncErrorThrowingComponent = () => {
  const throwError = async () => {
    throw new Error('Async error');
  };
  return (
    <p>
      In async error-throwing component. <button onClick={throwError}>Throw async error</button>
    </p>
  );
};

const MutationThrowingComponent = () => {
  const throwingMutation = useMutation({
    mutationFn: async () => {
      throw new Error('Mutation error');
    },
  });
  return (
    <p>
      Mutation throwing error. <button onClick={() => throwingMutation.mutate()}>Throw in mutation</button>
    </p>
  );
};

const ErrorStatusDisplay = () => {
  const { globalErrors, clearGlobalErrors } = useGlobalUnhandledErrors();
  return (
    <>
      <p>
        Global handler caught {globalErrors.length} errors so far.
        <button onClick={clearGlobalErrors}>Clear</button>
      </p>
    </>
  );
};

const InputComponent = () => {
  return (
    <>
      <label htmlFor="test-input">Test input: </label>
      <input type="text" name="test-input" id="test-input" />
    </>
  );
};

const DialogErrorTrigger = () => {
  const [open, setOpen] = useState(false);
  return (
    <p>
      Error from dialog (with form).
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <Dialog open={open} onOpenChange={nextOpen => setOpen(nextOpen)}>
        <Dialog.Popup width="medium">
          <Dialog.Header>
            <Dialog.Title>Registrer opplysningar</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <label htmlFor="dialog-input">Dialog input: </label>
            <input type="text" id="dialog-input" />
            <BodyShort>Dette er ein dummy-dialog som simulerer ein aktiv arbeidsflyt.</BodyShort>
            <Button
              variant="secondary-neutral"
              onClick={() => {
                throw new Error('Error from dialog');
              }}
            >
              Utløys feil
            </Button>
          </Dialog.Body>
        </Dialog.Popup>
      </Dialog>
    </p>
  );
};

const ErrorHandlingDemoApp = ({ foreverThrowInRender, maxErrorCount }: ErrorHandlingDemoAppProps) => {
  return (
    <>
      <GlobalUnhandledErrorCatcher maxErrorCount={maxErrorCount}>
        <TopErrorPanel />
        <h1>Demo app for demonstrating global top-level error handling</h1>
        <ErrorStatusDisplay />
        <InRenderErrorThrowingComponent foreverThrowInRender={foreverThrowInRender} />
        <NormalErrorThrowingComponent />
        <InAsyncErrorThrowingComponent />
        <MutationThrowingComponent />
        <DialogErrorTrigger />
        <InputComponent />
      </GlobalUnhandledErrorCatcher>
    </>
  );
};

const meta = {
  title: 'gui/app/errorhandling/GlobalUnhandledErrorCatcher',
  component: ErrorHandlingDemoApp,
  parameters: {
    layout: 'fullscreen',
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  decorators: [withTopDekoratør(), withErrorBoundary()],
} satisfies Meta<typeof ErrorHandlingDemoApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoError: Story = {};

export const RenderingError: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Throw render error' }));
  },
};

export const ContinuousFailure: Story = {
  args: {
    foreverThrowInRender: true,
  },
};

export const TooManyErrors: Story = {
  args: {
    maxErrorCount: 4, // Reduser denne for å forenkle testing av overskridelse
  },
  play: async ({ canvas }) => {
    // Lukk ErrorModal mellom kvar feil-klikk, slik at modalen ikkje blokkerer neste klikk
    const closeModal = async () => {
      await within(document.body).findByRole('alertdialog');
      await userEvent.keyboard('{Escape}');
    };

    // To vanlege feil via global error-listener
    await userEvent.click(canvas.getByRole('button', { name: 'Throw error' }));
    await closeModal();
    await userEvent.click(canvas.getByRole('button', { name: 'Throw error' }));
    await closeModal();

    await userEvent.click(await canvas.findByRole('button', { name: 'Throw render error' }));
    await closeModal();
    await userEvent.click(await canvas.findByRole('button', { name: 'Throw render error' }));
    await closeModal();
    await userEvent.click(await canvas.findByRole('button', { name: 'Throw render error' }));

    // Verifiser at "For mange feil" meldinga blir vist
    await expect(canvas.getByText(`For mange feil oppsto`, { exact: false })).toBeInTheDocument();
  },
};

export const InputValueRemains: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Test input:' });
    await userEvent.type(input, 'Test input data');
    await userEvent.click(canvas.getByRole('button', { name: 'Throw in mutation' }));
    await expect(input).toHaveValue('Test input data');
  },
};

/**
 * Viser ErrorModal som dukkar opp medan ein annan dialog allereie er open.
 * Simulerer eit scenario der brukar jobbar i ein dialog og ein uhandtert feil oppstår.
 */
export const ErrorWhileDialogOpen: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
    const dialog = await within(document.body).findByRole('dialog');
    const dialogInput = within(dialog).getByRole('textbox', { name: 'Dialog input:' });
    await userEvent.type(dialogInput, 'Skjemadata');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Utløys feil' }));
    const alertDialog = await within(document.body).findByRole('alertdialog');
    await expect(alertDialog).toBeInTheDocument();
    await expect(alertDialog).toBeVisible();
    // Verifiser at input-verdien i dialogen framleis er intakt etter feildialogen dukka opp
    await expect(dialogInput).toHaveValue('Skjemadata');
  },
};
