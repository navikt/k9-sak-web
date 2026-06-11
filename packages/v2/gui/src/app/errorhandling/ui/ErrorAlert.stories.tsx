import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, userEvent } from 'storybook/test';
import { useState } from 'react';
import { BodyLong, Button, VStack } from '@navikt/ds-react';
import { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { ErrorBoundary } from '../boundary/ErrorBoundary.js';
import { ErrorAlert } from './ErrorAlert.js';
import { retryAction } from './ErrorFixAction.js';
import { action } from 'storybook/actions';
import { makeFakeExtendedApiError } from '../../../storybook/mocks/fakeExtendedApiError.js';
import { AppError } from '../AppError.js';
import { TimeoutError } from '../legacycompat/TimeoutError.js';
import { BlobResponseAxiosError } from '../legacycompat/BlobResponseAxiosError.js';
import { resolveErrorViewProps } from './resolveErrorViewProps.js';
import { RocketIcon } from '@navikt/aksel-icons';

/**
 * Komponent som kastar ein feil når `shouldThrow` er true.
 * Brukast for å trigge ErrorBoundary i stories.
 */
const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new AppError({ title: 'Uventet feil', message: 'Lorem ipsum error' });
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
          <ErrorAlert
            {...resolveErrorViewProps(error)}
            fixAction={retryAction(() => {
              setShouldThrow(false);
              reset();
            })}
          />
        )}
      >
        <ThrowingComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </VStack>
  );
};

const meta = {
  title: 'gui/app/errorhandling/ui/ErrorAlert',
  component: ErrorAlert,
} satisfies Meta<typeof ErrorAlert>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Viser ErrorAlert direkte med faste props */
export const DefaultStory: Story = {
  args: {
    title: 'Resolved title',
    error: new AppError({ message: 'Error message' }),
    errorInfo: (
      <>
        <BodyLong>
          <b>errorInfo text.</b>
        </BodyLong>
        <BodyLong>Might be a long text about the problem.</BodyLong>
      </>
    ),
    fixAction: {
      label: 'Fix action label',
      info: <BodyLong>Fix info. (More text about how to resolve problem)</BodyLong>,
      icon: <RocketIcon />,
      callback: action('Fix problem'),
    },
  },
};

/** Viser ErrorAlert trigga via ErrorBoundary */
export const MedErrorBoundary: StoryObj = {
  render: () => <ErrorTriggerWrapper />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Trigger feil' }));
    await expect(canvas.getByText('Uventet feil')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Prøv på nytt' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Rapporter feil' })).toBeInTheDocument();
  },
};

/** Viser ErrorAlert med eigendefinert errorInfo */
export const MedEgneChildren: Story = {
  args: {
    title: 'Eksempel-feil',
    error: new AppError({ message: 'Lorem ipsum error' }),
    errorInfo: 'Eigendefinert feilmelding som overstyrer error.message.',
    fixAction: retryAction(action('fix problem')),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Eigendefinert feilmelding som overstyrer error.message.')).toBeInTheDocument();
    // Sjekk at standard error.message IKKJE visast
    await expect(canvas.queryByText('Lorem ipsum error.')).not.toBeInTheDocument();
  },
};

export const Minimal: Story = {
  args: resolveErrorViewProps(new AppError({ message: 'Uventet feil' })),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('Uventet feil').length).toBeGreaterThanOrEqual(2);
    await expect(canvas.queryByRole('button', { name: 'Last på nytt' })).toBeInTheDocument();
  },
};

export const BadRequest: Story = {
  args: resolveErrorViewProps(makeFakeExtendedApiError({ status: 400, body: { feilmelding: 'Felt 1 må fylles ut.' } })),
};
export const Unauthorized: Story = {
  args: resolveErrorViewProps(makeFakeExtendedApiError({ status: 401 })),
};
export const Forbidden: Story = {
  args: resolveErrorViewProps(makeFakeExtendedApiError({ status: 403 })),
};
export const NotFound: Story = {
  args: resolveErrorViewProps(makeFakeExtendedApiError({ status: 404 })),
};

/** Viser at reset-funksjonaliteten fungerer */
export const ResetEtterFeil: StoryObj = {
  render: () => <ErrorTriggerWrapper />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Trigger feil' }));
    await expect(canvas.getByText('Uventet feil')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Prøv på nytt' }));
    await expect(canvas.getByText('Innhald utan feil.')).toBeInTheDocument();
  },
};

// --- Hjelpefunksjon for å lage fake AxiosError ---
const makeFakeAxiosError = (status: number, data?: unknown, url = '/api/k9-sak/behandling'): AxiosError => {
  const headers = new AxiosHeaders();
  const config: InternalAxiosRequestConfig = { url, headers };
  const response: AxiosResponse = {
    status,
    statusText: `Status ${status}`,
    data,
    headers: {},
    config,
  };
  return new AxiosError(`Request failed with status code ${status}`, 'ERR_BAD_RESPONSE', config, undefined, response);
};

// --- AxiosError stories (resolveAxiosErrorView) ---

export const Axios401Unauthorized: Story = {
  args: resolveErrorViewProps(makeFakeAxiosError(401)),
};

export const Axios403Forbidden: Story = {
  args: resolveErrorViewProps(makeFakeAxiosError(403, { feilmelding: 'Du mangler tilgang til denne ressursen.' })),
};

export const Axios400BadRequest: Story = {
  args: resolveErrorViewProps(makeFakeAxiosError(400, { feilmelding: 'Felt "fødselsdato" er ugyldig.' })),
};

export const Axios404NotFound: Story = {
  args: resolveErrorViewProps(makeFakeAxiosError(404, undefined, '/api/k9-sak/behandling/123')),
};

export const Axios409Conflict: Story = {
  args: resolveErrorViewProps(
    makeFakeAxiosError(409, {
      feilmelding:
        'Behandlingen [1234567] har blitt oppdatert med ny informasjon av systemet, eller er endret av en annen saksbehandler. Prøv å laste inn behandlingen på nytt, hvis problemet vedvarer ta kontakt på teams. Fikk versjon [3], har versjon [5]',
    }),
  ),
};

export const Axios504GatewayTimeout: Story = {
  args: resolveErrorViewProps(makeFakeAxiosError(504, undefined, '/api/k9-sak/oppgave')),
};

export const Axios418PollingHalted: Story = {
  args: resolveErrorViewProps(
    makeFakeAxiosError(418, { status: 'HALTED', message: 'Eksternt system feilet under prosessering.' }),
  ),
};

export const Axios418PollingDelayed: Story = {
  args: resolveErrorViewProps(
    makeFakeAxiosError(418, {
      status: 'DELAYED',
      eta: '2026-05-14T10:00:00',
      message: 'Inntektskomponenten har planlagt nedetid.',
    }),
  ),
};

export const Axios500ServerError: Story = {
  args: resolveErrorViewProps(makeFakeAxiosError(500, { feilmelding: 'Uventet feil i backend-tjenesten.' })),
  play: async ({ canvas }) => {
    const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    // Ekspander rapporteringsseksjonen
    const rapporterBtn = canvas.getByRole('button', { name: 'Rapporter feil' });
    await userEvent.click(rapporterBtn);

    // Klikk kopier-knappen
    const kopierBtn = canvas.getByRole('button', { name: 'Kopier feilinformasjon' });
    await userEvent.click(kopierBtn);

    // Verifiser at clipboard blei skrive til med relevant innhald
    await expect(writeText).toHaveBeenCalledTimes(1);
    const clipboardText = writeText.mock.calls[0]?.[0] as string;
    await expect(clipboardText).toContain('500');
    await expect(clipboardText).toContain('AxiosError');

    writeText.mockRestore();
  },
};

export const AxiosNetworkError: Story = {
  args: resolveErrorViewProps(new AxiosError('Network Error', 'ERR_NETWORK')),
};

// --- BlobResponseAxiosError stories ---

export const BlobResponseError: Story = {
  args: resolveErrorViewProps(
    new BlobResponseAxiosError(
      makeFakeAxiosError(500, undefined, '/api/k9-formidling/brev'),
      JSON.stringify({ feilmelding: 'Feil ved generering av dokument.' }),
    ),
  ),
};

export const BlobResponse418Halted: Story = {
  args: resolveErrorViewProps(
    new BlobResponseAxiosError(
      makeFakeAxiosError(418, undefined, '/api/k9-formidling/brev'),
      JSON.stringify({ status: 'HALTED', message: 'Dokumentgenerering stoppet.' }),
    ),
  ),
};

// --- TimeoutError stories (resolveTimeoutErrorView) ---

export const PollingTimeout: Story = {
  args: resolveErrorViewProps(new TimeoutError('/api/k9-sak/behandling/status')),
};
