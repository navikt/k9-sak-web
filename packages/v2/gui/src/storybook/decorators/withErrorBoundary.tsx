import type { Decorator } from '@storybook/react-vite';
import type { FC } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '../../app/errorhandling/boundary/ErrorBoundary.js';

interface WithErrorBoundaryOptions {
  maxErrorCount?: number;
  errorCallback?: (error: Error) => void;
  errorFallback?: FC<ErrorBoundaryFallbackProps>;
  filter?: (error: Error) => boolean;
}

/**
 * Storybook-dekorator som pakkar Story i ein ErrorBoundary.
 */
const withErrorBoundary =
  (options: WithErrorBoundaryOptions = {}): Decorator =>
  Story => (
    <ErrorBoundary {...options}>
      <Story />
    </ErrorBoundary>
  );

export default withErrorBoundary;
