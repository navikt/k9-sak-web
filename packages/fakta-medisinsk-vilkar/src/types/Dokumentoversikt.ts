import { dokumentSorter } from '../util/dokumentUtils';
import Dokument, { Dokumenttype } from './Dokument';

class Dokumentoversikt {
    alleDokumenter: Dokument[];

    strukturerteDokumenter: Dokument[];

    ustrukturerteDokumenter: Dokument[];

    constructor(dokumenter: Dokument[]) {
        this.alleDokumenter = dokumenter;
        this.strukturerteDokumenter = dokumenter
            .filter(({ type }) => type !== Dokumenttype.UKLASSIFISERT)
            .sort(dokumentSorter);
        this.ustrukturerteDokumenter = dokumenter
            .filter(({ type }) => type === Dokumenttype.UKLASSIFISERT)
            .sort(dokumentSorter);
    }

    harGyldigSignatur(): boolean {
        return this.strukturerteDokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    }

    harDokumenter(): boolean {
        return this.strukturerteDokumenter.length > 0 || this.ustrukturerteDokumenter.length > 0;
    }

    harUstrukturerteDokumenter(): boolean {
        return this.ustrukturerteDokumenter.length > 0;
    }
}

export default Dokumentoversikt;
