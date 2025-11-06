import { FileIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Link } from '@navikt/ds-react';
import type { BeriketDokumentLink } from '../api/HistorikkBackendApi.js';

interface DokumentLenkeProps {
  readonly dokumentLink: BeriketDokumentLink;
}

export const DokumentLenke = ({ dokumentLink }: DokumentLenkeProps) => {
  if (dokumentLink.utgått) {
    return (
      <HStack align="center" gap="space-4">
        <FileIcon title={dokumentLink.tag} width={24} height={24} />
        <BodyShort size="small">{dokumentLink.tag} (utgått)</BodyShort>
      </HStack>
    );
  }
  return (
    <Link target="_blank" rel="noopener noreferrer" href={dokumentLink.serverUrl}>
      <HStack align="center" gap="space-4">
        <FileIcon title={dokumentLink.tag} width={24} height={24} />
        {dokumentLink.tag}
      </HStack>
    </Link>
  );
};
