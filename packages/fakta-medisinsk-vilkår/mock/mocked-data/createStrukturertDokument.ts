import mockedDokumentoversikt from './mockedDokumentoversikt';
import Dokument from '../../src/types/Dokument';

const createStrukturertDokument = (dokument: Dokument) => {
  const index = mockedDokumentoversikt.dokumenter.findIndex(({ id }) => dokument.id === id);
  mockedDokumentoversikt.dokumenter[index] = dokument;
};

export default createStrukturertDokument;
