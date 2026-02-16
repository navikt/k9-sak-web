import type Dokument from '../../src/types/Dokument';
import mockedDokumentoversikt from './mockedDokumentoversikt';

const createStrukturertDokument = (dokument: Dokument) => {
  const index = mockedDokumentoversikt.dokumenter.findIndex(({ id }) => dokument.id === id);
  mockedDokumentoversikt.dokumenter[index] = dokument;
};

export default createStrukturertDokument;
