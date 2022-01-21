import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dokumentnavigasjon from './Dokumentnavigasjon';
import mockedDokumentoversikt from '../../../../mock/mocked-data/mockedDokumentoversikt';

describe('Dokumentnavigasjon', () => {
    const { dokumenter } = mockedDokumentoversikt;

    it('should render "Ingen dokumenter å vise" text when there are no documents to show', () => {
        render(
            <Dokumentnavigasjon
                tittel="something"
                valgtDokument={null}
                dokumenter={[]}
                onDokumentValgt={() => null}
                expandedByDefault
            />
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
            />
        );

        expect(screen.getByText(/ikke klassifisert/i)).toBeInTheDocument();
        expect(screen.getByText(/andre med. oppl./i)).toBeInTheDocument();
        expect(screen.getByText(/ikke med. oppl./i)).toBeInTheDocument();
    });

    it('should show no documents when not expanded by default', async () => {
        render(
            <Dokumentnavigasjon
                tittel="something"
                valgtDokument={dokumenter[0]}
                dokumenter={dokumenter}
                onDokumentValgt={() => null}
            />
        );

        expect(screen.queryByText(/ikke klassifisert/i)).toBeNull();
        expect(screen.queryByText(/andre med. oppl./i)).toBeNull();
        expect(screen.queryByText(/ikke med. oppl./i)).toBeNull();
    });

    test('documents are filtered correctly', () => {
        render(
            <Dokumentnavigasjon
                tittel="Something"
                valgtDokument={dokumenter[0]}
                dokumenter={[...dokumenter]}
                onDokumentValgt={() => null}
                expandedByDefault
                displayFilterOption
            />
        );
        expect(screen.getByText(/ikke klassifisert/i)).toBeInTheDocument();

        userEvent.click(screen.getAllByText(/type/i)[0]);

        const ikkeKlassifisertCheckbox = screen.getByLabelText(/ikke klassifisert/i);
        userEvent.click(ikkeKlassifisertCheckbox);
        userEvent.click(screen.getAllByText(/type/i)[1]);

        expect(screen.queryByText(/ikke klassifisert/i)).toBeFalsy();
    });

    test('dropdown filter opens and closes correctly when filter functionality is activated', () => {
        render(
            <Dokumentnavigasjon
                tittel="something"
                valgtDokument={dokumenter[0]}
                dokumenter={[dokumenter[0], dokumenter[1]]}
                expandedByDefault
                displayFilterOption
                onDokumentValgt={() => null}
            />
        );

        userEvent.click(screen.getAllByText(/type/i)[0]);
        let ikkeKlassifisertCheckbox = screen.queryByLabelText(/ikke klassifisert/i);
        expect(ikkeKlassifisertCheckbox).toBeTruthy();

        userEvent.click(document.body);
        ikkeKlassifisertCheckbox = screen.queryByLabelText(/ikke klassifisert/i);
        expect(ikkeKlassifisertCheckbox).toBeFalsy();
    });
});
