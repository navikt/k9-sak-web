/* eslint-disable max-len */
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { cleanup, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { intlMock } from '../../i18n/index';
import DocumentList from './DocumentList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const wrapper = children => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

describe('<DocumentList>', () => {
  afterEach(() => {
    cleanup();
  });

  it('skal vise to dokumenter i liste', async () => {
    const document = {
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Terminbekreftelse',
      tidspunkt: '0405198632231',
      kommunikasjonsretning: 'INN',
    };

    const anotherDocument = {
      journalpostId: '2',
      dokumentId: '2',
      tittel: 'Førstegangssøknad',
      tidspunkt: '0405198632231',
      kommunikasjonsretning: 'UT',
    };

    renderWithIntl(
      wrapper(
        <DocumentList.WrappedComponent
          intl={intlMock}
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
      tidspunkt: null,
      kommunikasjonsretning: 'INN',
    };

    renderWithIntl(
      <QueryClientProvider client={queryClient}>
        <DocumentList.WrappedComponent
          intl={intlMock}
          documents={[document]}
          behandlingId={1}
          saksnummer={1}
          behandlingUuid="1"
          sakstype="PSB"
        />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('missing-timestamp')).toBeInTheDocument();
    });
  });

  it('skal ikke vise tabell når det ikke finnes dokumenter', async () => {
    renderWithIntl(
      <QueryClientProvider client={queryClient}>
        <DocumentList.WrappedComponent
          intl={intlMock}
          documents={[]}
          behandlingId={1}
          saksnummer={1}
          behandlingUuid="1"
          sakstype="PSB"
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('no-documents')).toBeInTheDocument();
    });
  });
});
