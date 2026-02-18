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
    return this.strukturerteDokumenter.some(({ type }) =>
      [
        Dokumenttype.LEGEERKLÆRING,
        Dokumenttype.LEGEERKLÆRING_ANNEN,
        Dokumenttype.LEGEERKLÆRING_MED_DOKUMENTASJON_AV_OPPLÆRING,
      ].includes(type),
    );
  }

  harDokumenter(): boolean {
    return this.strukturerteDokumenter.length > 0 || this.ustrukturerteDokumenter.length > 0;
  }

  harUstrukturerteDokumenter(): boolean {
    return this.ustrukturerteDokumenter.length > 0;
  }
}

export default Dokumentoversikt;
