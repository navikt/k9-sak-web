import { type ReactNode, Suspense } from 'react';
import { LoadingPanel } from './LoadingPanel.js';

interface LoadingPanelSuspenseProps {
  readonly children: ReactNode;
}

/**
 * A Suspense boundary that displays our default LoadingPanel spinner
 */
export const LoadingPanelSuspense = ({ children }: LoadingPanelSuspenseProps) => (
  <Suspense fallback={<LoadingPanel />} name="loading-panel-suspense">
    {children}
  </Suspense>
);
