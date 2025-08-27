import { isUngWeb } from '@k9-sak-web/gui/utils/urlUtils.js';
import { FileIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Link } from '@navikt/ds-react';
import { DOCUMENT_SERVER_URL_K9, DOCUMENT_SERVER_URL_UNG } from '../documentServerUrl.js';
import type { HistorikkInnslagDokumentLink } from '../tilbake/historikkinnslagTsTypeV2.js';

interface Props {
  dokumentLenke: HistorikkInnslagDokumentLink;
  saksnummer: string;
}

export const HistorikkDokumentLenke = ({
  dokumentLenke: { tag, journalpostId, dokumentId, utgått },
  saksnummer,
}: Props) => {
  const isUng = isUngWeb();
  if (utgått) {
    return (
      <HStack align="center" gap="space-4">
        <FileIcon title={tag} width={24} height={24} />
        <BodyShort size="small">{tag} (utgått)</BodyShort>
      </HStack>
    );
  }
  return (
    <Link
      href={`${isUng ? DOCUMENT_SERVER_URL_UNG : DOCUMENT_SERVER_URL_K9}?saksnummer=${saksnummer}&journalpostId=${journalpostId}&dokumentId=${dokumentId}`}
    >
      <HStack align="center" gap="space-4">
        <FileIcon title={tag} width={24} height={24} />
        {tag}
      </HStack>
    </Link>
  );
};
