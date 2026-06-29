import type { Decorator } from '@storybook/react-vite';
import { ErrorBoundary, type ErrorBoundaryProps } from '../../app/errorhandling/boundary/ErrorBoundary.js';

/**
 * Storybook-dekorator som pakkar Story i ein ErrorBoundary.
 */
const withErrorBoundary =
  (options: Omit<ErrorBoundaryProps, 'children'> = {}): Decorator =>
  Story => (
    <ErrorBoundary {...options}>
      <Story />
    </ErrorBoundary>
  );

export default withErrorBoundary;
