import { type FC, type ReactNode, Suspense } from 'react';
import { RootFallback } from './RootFallback.js';

/**
 * Toppnivå Suspense for frontend. Visast før grunnleggande init data er lasta. Dette er data som normalt ikkje blir
 * lasta på nytt før full refresh, og som er nødvendige for at frontend i heile tatt skal fungere.
 */
export const RootSuspense: FC<{ children: ReactNode }> = ({ children }) => {
  return <Suspense fallback={<RootFallback />}>{children}</Suspense>;
};
