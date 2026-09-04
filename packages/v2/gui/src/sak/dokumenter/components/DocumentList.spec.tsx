/* eslint-disable max-len */
import { k9_kodeverk_dokument_Kommunikasjonsretning as Kommunikasjonsretning } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { createQueryClient } from '../../../shared/query/queryClient.js';
import { fakeK9Kodeverkoppslag } from '../../../kodeverk/mocks/fakeK9Kodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '../../../kodeverk/oppslag/K9KodeverkoppslagContext.js';
import DocumentListContainer from './DocumentListContainer.js';
import DocumentListNew from './DocumentListNew.js';

const queryClient = createQueryClient({
  queries: {
    retry: false,
  },
});

const wrapper = (children: React.ReactNode) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const documents = [
  {
    journalpostId: '1',
    dokumentId: '1',
    tittel: 'Inngående dokument',
    tidspunkt: new Date().toDateString(),
    kommunikasjonsretning: Kommunikasjonsretning.INN,
  },
  {
    journalpostId: '2',
    dokumentId: '2',
    tittel: 'Utgående dokument',
    tidspunkt: new Date().toDateString(),
    kommunikasjonsretning: Kommunikasjonsretning.UT,
  },
];

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
      behandlinger: [1],
    };

    const anotherDocument = {
      journalpostId: '2',
      dokumentId: '2',
      tittel: 'Førstegangssøknad',
      tidspunkt: new Date().toDateString(),
      kommunikasjonsretning: Kommunikasjonsretning.UT,
      behandlinger: [1],
    };

    render(
      wrapper(
        <DocumentListContainer
          documents={[document, anotherDocument]}
          behandlingId={1}
          saksnummer={1}
          behandlingUuid="1"
          sakstype={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
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
      behandlinger: [1],
    };

    render(
      <QueryClientProvider client={queryClient}>
        <DocumentListContainer
          documents={[document]}
          behandlingId={1}
          saksnummer={1}
          behandlingUuid="1"
          sakstype={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
        />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('missing-timestamp')).toBeInTheDocument();
    });
  });

  it('skal ikke vise tabell når det ikke finnes dokumenter', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DocumentListContainer
          documents={[]}
          behandlingId={1}
          saksnummer={1}
          behandlingUuid="1"
          sakstype={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('no-documents')).toBeInTheDocument();
    });
  });

  it('skal filtrere på inngående og utgående dokumenter', async () => {
    const user = userEvent.setup();

    render(
      wrapper(
        <K9KodeverkoppslagContext.Provider value={fakeK9Kodeverkoppslag()}>
          <DocumentListNew
            documents={documents}
            saksnummer={1}
            behandlingUuid="1"
            sakstype={fagsakYtelsesType.FRISINN}
          />
        </K9KodeverkoppslagContext.Provider>,
      ),
    );

    const dokumenttypeFilter = screen.getByRole('combobox', { name: 'Dokumenttype' });
    await user.click(dokumenttypeFilter);
    await user.click(screen.getByRole('option', { name: 'Inngående dokumenter' }));

    expect(screen.getByText('Inngående dokument')).toBeInTheDocument();
    expect(screen.queryByText('Utgående dokument')).not.toBeInTheDocument();

    await user.click(dokumenttypeFilter);
    await user.click(screen.getByRole('option', { name: 'Inngående dokumenter' }));
    await user.click(screen.getByRole('option', { name: 'Utgående dokumenter' }));

    expect(screen.queryByText('Inngående dokument')).not.toBeInTheDocument();
    expect(screen.getByText('Utgående dokument')).toBeInTheDocument();
  });
});
