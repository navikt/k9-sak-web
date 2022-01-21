import Dokument from '../../types/Dokument';
import { finnBenyttedeDokumenter } from '../dokumentUtils';

describe('dokumentUtils', () => {
    let result: Dokument[] = [];

    const dokumenter: Partial<Dokument>[] = [
        {
            id: '1',
        },
        {
            id: '2',
        },
        {
            id: '3',
        },
    ];

    beforeAll(() => {
        const valgteDokumentIder: string[] = ['1', '2', '4'];
        result = finnBenyttedeDokumenter(valgteDokumentIder, dokumenter as Dokument[]);
    });

    it('should return all documents that are benyttet', () => {
        expect(result).toContain(dokumenter[0]);
        expect(result).toContain(dokumenter[1]);
    });

    it('should not return any documents that are not benyttet', () => {
        expect(result).not.toContain(dokumenter[2]);
    });

    it('should not return any documents that are benyttet but is not contained in the list of documents', () => {
        expect(result.some((dokument) => dokument.id === '4')).toBe(false);
    });
});
