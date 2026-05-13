import type { ErrorBoundaryFallbackProps } from './ErrorBoundary.js';
import { LocalAlertError } from '../ui/LocalAlertError.js';
import { resolveErrorViewProps } from '../ui/resolveErrorViewProps.js';
import { Box } from '@navikt/ds-react';

export const DefaultErrorView = ({ error }: ErrorBoundaryFallbackProps) => {
  return (
    <Box padding="space-16">
      <LocalAlertError {...resolveErrorViewProps(error)} />
    </Box>
  );
};
