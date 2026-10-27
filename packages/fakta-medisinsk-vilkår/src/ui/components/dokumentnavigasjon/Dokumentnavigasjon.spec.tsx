import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockedDokumentoversikt from '../../../../mock/mocked-data/mockedDokumentoversikt';
import { Dokumenttype } from '../../../types/Dokument';
import Dokumentnavigasjon from './Dokumentnavigasjon';

const lagDokument = (id: string, datert: string) => ({
  id,
  navn: `Dokument ${id}`,
  type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
  datert,
  links: [],
  benyttet: true,
  annenPartErKilde: false,
  fremhevet: false,
  behandlet: true,
  mottattDato: datert,
  mottattTidspunkt: `${datert}T10:00:00`,
  duplikater: [],
  duplikatAvId: null,
  bruktTilMinstEnVurdering: false,
});

describe('Dokumentnavigasjon', () => {
  const { dokumenter } = mockedDokumentoversikt;

  it('should render "Ingen dokumenter å vise" text when there are no documents to show', async () => {
    render(<Dokumentnavigasjon tittel="something" valgtDokument={null} dokumenter={[]} onDokumentValgt={() => null} />);

    expect(screen.getByText(/Ingen dokumenter å vise/i)).toBeInTheDocument();
  });

  test('documents are filtered correctly', async () => {
    render(
      <Dokumentnavigasjon
        tittel="Something"
        valgtDokument={dokumenter[0]}
        dokumenter={[...dokumenter]}
        onDokumentValgt={() => null}
        expandedByDefault
        displayFilterOption
      />,
    );
    expect(screen.getByText(/ikke klassifisert/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Type' }));

    const ikkeKlassifisertCheckbox = await screen.findByLabelText(/ikke klassifisert/i);
    await userEvent.click(ikkeKlassifisertCheckbox);
    await userEvent.click(screen.getAllByText(/type/i)[1]);

    await waitFor(() => expect(screen.queryByText(/ikke klassifisert/i)).not.toBeInTheDocument());
  });

  test('dropdown filter opens and closes correctly when filter functionality is activated', async () => {
    render(
      <Dokumentnavigasjon
        tittel="something"
        valgtDokument={dokumenter[0]}
        dokumenter={[dokumenter[0], dokumenter[2]]}
        expandedByDefault
        displayFilterOption
        onDokumentValgt={() => null}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Type' }));
    const ikkeKlassifisertCheckbox = await screen.findByLabelText(/ikke klassifisert/i);
    expect(ikkeKlassifisertCheckbox).toBeTruthy();

    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByLabelText(/ikke klassifisert/i)).not.toBeInTheDocument());
  });

  describe('pagination', () => {
    const seksDokumenter = [1, 2, 3, 4, 5, 6].map(n => lagDokument(String(n), `2022-01-0${n}`));

    test('does not show pagination when usePagination is false', () => {
      render(
        <Dokumentnavigasjon
          tittel="something"
          valgtDokument={null}
          dokumenter={seksDokumenter}
          onDokumentValgt={() => null}
        />,
      );
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    test('shows pagination and only the first page when there are more than 5 documents', () => {
      render(
        <Dokumentnavigasjon
          tittel="something"
          valgtDokument={null}
          dokumenter={seksDokumenter}
          onDokumentValgt={() => null}
          usePagination
        />,
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('01.01.2022')).toBeInTheDocument();
      expect(screen.getByText('05.01.2022')).toBeInTheDocument();
      expect(screen.queryByText('06.01.2022')).not.toBeInTheDocument();
    });

    test('navigates to the next page and shows the correct documents', async () => {
      render(
        <Dokumentnavigasjon
          tittel="something"
          valgtDokument={null}
          dokumenter={seksDokumenter}
          onDokumentValgt={() => null}
          usePagination
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Neste' }));
      await waitFor(() => expect(screen.getByText('06.01.2022')).toBeInTheDocument());
      expect(screen.queryByText('01.01.2022')).not.toBeInTheDocument();
    });
  });
});
