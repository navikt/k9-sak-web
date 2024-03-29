import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import mockedDokumentoversikt from '../../../../mock/mocked-data/mockedDokumentoversikt';
import Dokumentnavigasjon from './Dokumentnavigasjon';

describe('Dokumentnavigasjon', () => {
  const { dokumenter } = mockedDokumentoversikt;

  it('should render "Ingen dokumenter å vise" text when there are no documents to show', async () => {
    render(
      <Dokumentnavigasjon
        tittel="something"
        valgtDokument={null}
        dokumenter={[]}
        onDokumentValgt={() => null}
        expandedByDefault
      />,
    );

    expect(screen.getByText(/Ingen dokumenter å vise/i)).toBeInTheDocument();
  });

  it('should render documents in list when expanded by default', async () => {
    render(
      <Dokumentnavigasjon
        tittel="something"
        valgtDokument={dokumenter[0]}
        dokumenter={dokumenter}
        onDokumentValgt={() => null}
        expandedByDefault
      />,
    );

    expect(screen.getByText(/ikke klassifisert/i)).toBeInTheDocument();
    expect(screen.getByText(/andre med. oppl./i)).toBeInTheDocument();
    expect(screen.getByText(/ikke med. oppl./i)).toBeInTheDocument();
  });

  it('should show no documents when not expanded by default', async () => {
    const { container } = render(
      <Dokumentnavigasjon
        tittel="something"
        valgtDokument={dokumenter[0]}
        dokumenter={dokumenter}
        onDokumentValgt={() => null}
      />,
    );
    expect(container.getElementsByClassName('navds-accordion__content--closed')).toHaveLength(1);
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
        dokumenter={[dokumenter[0], dokumenter[1]]}
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
});
