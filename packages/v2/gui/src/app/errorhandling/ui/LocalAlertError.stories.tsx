import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { useState } from 'react';
import { Button, VStack } from '@navikt/ds-react';
import { ErrorBoundary } from '../feilmeldinger/ErrorBoundary.js';
import { LocalAlertError } from './LocalAlertError.js';

/**
 * Komponent som kastar ein feil når `shouldThrow` er true.
 * Brukast for å trigge ErrorBoundary i stories.
 */
const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Lorem ipsum error');
  }
  return <div>Innhald utan feil.</div>;
};

/**
 * Wrapper som lar brukaren trigge ein feil via ein knapp.
 */
const ErrorTriggerWrapper = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  return (
    <VStack gap="space-16">
      <Button size="small" onClick={() => setShouldThrow(true)}>
        Trigger feil
      </Button>
      <ErrorBoundary
        errorFallback={({ error, reset }) => (
          <LocalAlertError
            title="Eksempel-feil"
            error={error}
            onTryAgain={() => {
              setShouldThrow(false);
              reset();
            }}
          />
        )}
      >
        <ThrowingComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </VStack>
  );
};

const meta = {
  title: 'gui/app/errorhandling/ui/LocalAlertError',
  component: LocalAlertError,
} satisfies Meta<typeof LocalAlertError>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Viser LocalAlertError direkte med faste props */
export const DefaultStory: Story = {
  args: {
    title: 'Eksempel-feil',
    error: new Error('Lorem ipsum error'),
    onTryAgain: () => {},
  },
};

/** Viser LocalAlertError trigga via ErrorBoundary */
export const MedErrorBoundary: StoryObj = {
  render: () => <ErrorTriggerWrapper />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Trigger feil' }));
    await expect(canvas.getByText('Eksempel-feil')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Prøv på nytt' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Rapporter feil' })).toBeInTheDocument();
  },
};

/** Viser at children overstyrer standard error.message-visning */
export const MedEgneChildren: Story = {
  args: {
    title: 'Eksempel-feil',
    error: new Error('Lorem ipsum error'),
    onTryAgain: () => {},
    children: 'Eigendefinert feilmelding som overstyrer error.message.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Eigendefinert feilmelding som overstyrer error.message.')).toBeInTheDocument();
    // Sjekk at standard error.message IKKJE visast
    await expect(canvas.queryByText('Lorem ipsum error.')).not.toBeInTheDocument();
  },
};

/** Viser komponenten utan onTryAgain — "Last på nytt" knappen istadenfor "Prøv på nytt" */
export const UtenOnTryAgain: Story = {
  args: {
    title: 'Eksempel-feil',
    error: new Error('Lorem ipsum error'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Eksempel-feil')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Last på nytt' })).toBeInTheDocument();
  },
};

/** Viser at reset-funksjonaliteten fungerer */
export const ResetEtterFeil: StoryObj = {
  render: () => <ErrorTriggerWrapper />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Trigger feil' }));
    await expect(canvas.getByText('Eksempel-feil')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Prøv på nytt' }));
    await expect(canvas.getByText('Innhald utan feil.')).toBeInTheDocument();
  },
};
