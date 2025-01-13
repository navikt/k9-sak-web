import { FileIcon } from '@navikt/aksel-icons';
import { Button, Link } from '@navikt/ds-react';
import * as React from 'react';

interface DokumentKnappProps {
  href: string;
}

const DokumentKnapp = ({ href }: DokumentKnappProps): JSX.Element => (
  <Button
    as={Link}
    href={href}
    target="_blank"
    underline={false}
    size="small"
    variant="secondary"
    icon={<FileIcon aria-hidden fontSize="1.5rem" />}
  >
    Åpne dokument
  </Button>
);

export default DokumentKnapp;
