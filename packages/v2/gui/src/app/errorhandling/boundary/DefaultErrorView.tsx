import type { ErrorBoundaryFallbackProps } from './ErrorBoundary.js';
import { LocalAlertError } from '../ui/LocalAlertError.js';
import { Box } from '@navikt/ds-react';

export const DefaultErrorView = ({ error }: ErrorBoundaryFallbackProps) => {
  return (
    <Box padding="space-16">
      <LocalAlertError error={error} />
    </Box>
  );
};
