import type { ErrorBoundaryFallbackProps } from './ErrorBoundary.js';
import { ErrorAlert } from '../ui/ErrorAlert.js';
import { resolveErrorViewProps } from '../ui/resolveErrorViewProps.js';
import { Box } from '@navikt/ds-react';

export const DefaultErrorView = ({ error }: ErrorBoundaryFallbackProps) => {
  return (
    <Box padding="space-16">
      <ErrorAlert {...resolveErrorViewProps(error)} />
    </Box>
  );
};
