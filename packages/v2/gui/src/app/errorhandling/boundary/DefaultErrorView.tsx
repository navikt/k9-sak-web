import type { ErrorBoundaryFallbackProps } from './ErrorBoundary.js';
import { LocalAlertError } from '../ui/LocalAlertError.js';

export const DefaultErrorView = ({ caught }: ErrorBoundaryFallbackProps) => {
  return <LocalAlertError errorAndId={caught} />;
};
