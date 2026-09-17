import type { DokumentDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/DokumentDto.js';
import { type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { useContext } from 'react';
import type { FagsakPerson } from '../types/FagsakPerson';
import DocumentListNew from './DocumentListNew';
import DocumentListOld from './DocumentListOld';

interface OwnProps {
  documents: DokumentDto[];
  behandlingId?: number;
  fagsakPerson?: FagsakPerson;
  saksnummer: number;
  behandlingUuid: string;
  sakstype: FagsakYtelsesType;
}

/**
 * DocumentList
 *
 * Velger mellom gammel og ny visning av dokumentlisten basert på DOKUMENTFILTER-toggelen.
 */
const DocumentListContainer = (props: OwnProps) => {
  const { DOKUMENTFILTER } = useContext(FeatureTogglesContext);
  return DOKUMENTFILTER ? <DocumentListNew {...props} /> : <DocumentListOld {...props} />;
};

export default DocumentListContainer;
