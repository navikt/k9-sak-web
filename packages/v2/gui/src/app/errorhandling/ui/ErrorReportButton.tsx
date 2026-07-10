import { Button } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import type { FC } from 'react';

export const ErrorReportButton: FC<{ reportLink: string }> = ({ reportLink }) => {
  return (
    <Button
      variant="secondary"
      data-color="neutral"
      size="small"
      as="a"
      href={reportLink}
      target="_blank"
      rel="noopener"
      icon={<ExternalLinkIcon />}
      iconPosition="right"
    >
      Meld feil i porten
    </Button>
  );
};
