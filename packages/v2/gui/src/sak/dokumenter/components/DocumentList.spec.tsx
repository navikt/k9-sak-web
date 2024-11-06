/* eslint-disable max-len */
import { Kommunikasjonsretning } from '@k9-sak-web/backend/k9sak/kodeverk/Kommunikasjonsretning.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import DocumentList from './DocumentList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const wrapper = (children: React.ReactNode) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('<DocumentList>', () => {
  afterEach(() => {
    cleanup();
  });

  it('skal vise to dokumenter i liste', async () => {
    const document = {
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Terminbekreftelse',
      tidspunkt: new Date().toDateString(),
      kommunikasjonsretning: Kommunikasjonsretning.INN,
    };

    const anotherDocument = {
      journalpostId: '2',
      dokumentId: '2',
      tittel: 'Førstegangssøknad',
      tidspunkt: new Date().toDateString(),
      kommunikasjonsretning: Kommunikasjonsretning.UT,
    };

    render(
      wrapper(
        <DocumentList
          documents={[document, anotherDocument]}
          behandlingId={1}
          saksnummer={1}
          behandlingUuid="1"
          sakstype="PSB"
        />,
      ),
    );
    await waitFor(() => {
      expect(screen.getByText('Terminbekreftelse')).toBeInTheDocument();
      expect(screen.getByText('Førstegangssøknad')).toBeInTheDocument();
    });
  });

  it('skal vise korrekt tekst om ikke tidspunkt finnes', async () => {
    const document = {
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Terminbekreftelse',
      tidspunkt: '',
      kommunikasjonsretning: Kommunikasjonsretning.INN,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <DocumentList documents={[document]} behandlingId={1} saksnummer={1} behandlingUuid="1" sakstype="PSB" />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('missing-timestamp')).toBeInTheDocument();
    });
  });

  it('skal ikke vise tabell når det ikke finnes dokumenter', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DocumentList documents={[]} behandlingId={1} saksnummer={1} behandlingUuid="1" sakstype="PSB" />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('no-documents')).toBeInTheDocument();
    });
  });
});
