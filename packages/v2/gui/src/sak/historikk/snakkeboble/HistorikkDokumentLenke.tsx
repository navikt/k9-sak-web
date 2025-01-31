import { FileIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import type { HistorikkInnslagDokumentLink } from '../historikkinnslagTsTypeV2.js';
import { DOCUMENT_SERVER_URL } from '../documentServerUrl.js';

interface Props {
  dokumentLenke: HistorikkInnslagDokumentLink;
  saksnummer: string;
}

export const HistorikkDokumentLenke = ({
  dokumentLenke: { tag, journalpostId, dokumentId, utgått },
  saksnummer,
}: Props) => {
  if (utgått) {
    return (
      <HStack align="center" gap="1">
        <FileIcon title={tag} width={24} height={24} />
        <BodyShort size="small">{tag}</BodyShort>
      </HStack>
    );
  }
  return (
    <HStack
      as="a"
      align="center"
      gap="1"
      href={`${DOCUMENT_SERVER_URL}?saksnummer=${saksnummer}&journalpostId=${journalpostId}&dokumentId=${dokumentId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FileIcon title={tag} width={24} height={24} />
      {tag}
    </HStack>
  );
};
