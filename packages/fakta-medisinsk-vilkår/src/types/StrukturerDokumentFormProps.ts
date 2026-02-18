import { Dokument } from './Dokument';

interface StrukturerDokumentFormProps {
  dokument: Dokument;
  onSubmit: (nyttDokument: Dokument) => void;
  editMode?: boolean;
  isSubmitting: boolean;
  strukturerteDokumenter: Dokument[];
}

export default StrukturerDokumentFormProps;
