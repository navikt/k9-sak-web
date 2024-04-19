import { FileIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';
import * as React from 'react';

interface DokumentKnappProps {
  href: string;
}

const DokumentKnapp = ({ href }: DokumentKnappProps): JSX.Element => (
  <Link
    href={href}
    target="_blank"
    underline={false}
    className="navds-button navds-button--secondary navds-button--small"
  >
    <span className="navds-button__icon">
      <FileIcon aria-hidden fontSize="1.5rem" />
    </span>
    <span className="navds-label navds-label--small">Åpne dokument</span>
  </Link>
);

export default DokumentKnapp;
