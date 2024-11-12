import { UnhandledRejectionCatcher } from '@k9-sak-web/gui/app/UnhandledRejectionCatcher.js';
import NotFoundPage from '@k9-sak-web/gui/sak/feilmeldinger/NotFoundPage.js';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import FagsakIndex from '../../fagsak/FagsakIndex';
import { fagsakRoutePath } from '../paths';
import DashboardResolver from './DashboardResolver';
import styles from './home.module.css';

interface OwnProps {
  headerHeight: number;
}

// Brukes av RequestRunner.ts for å lukke en popup som logger inn igjen ved 401
const CloseWindow = () => {
  window.close();
  return <div />;
};

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const queryClient = new QueryClient();
/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home = ({ headerHeight }: OwnProps) => (
  <div className={styles.content} style={{ margin: `${headerHeight}px auto 0` }}>
    <UnhandledRejectionCatcher />
    <QueryClientProvider client={queryClient}>
      <SentryRoutes>
        <Route path="/" element={<DashboardResolver />} />
        <Route path={fagsakRoutePath} element={<FagsakIndex />} />
        <Route path="/close" element={<CloseWindow />} />
        <Route path="*" element={<NotFoundPage />} />
      </SentryRoutes>
    </QueryClientProvider>
  </div>
);

export default Home;
