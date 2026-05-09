import type { ErrorBoundaryFallbackProps } from './ErrorBoundary.js';
import { LocalAlertError } from '../ui/LocalAlertError.js';

export const DefaultErrorView = ({ error }: ErrorBoundaryFallbackProps) => {
  return <LocalAlertError error={error} />;
};
