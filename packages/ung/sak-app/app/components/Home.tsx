import * as Sentry from '@sentry/react';
import { Route, Routes } from 'react-router';

import NotFoundPage from '@k9-sak-web/gui/app/errorhandling/pages/NotFoundPage.js';

import FagsakIndex from '../../fagsak/FagsakIndex';
import { fagsakRoutePath } from '../paths';

import styles from './home.module.css';
import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';
import ErrorBoundary from '@k9-sak-web/gui/app/errorhandling/feilmeldinger/ErrorBoundary.js';

interface OwnProps {
  headerHeight: number;
}

// Brukes av RequestRunner.ts for å lukke en popup som logger inn igjen ved 401
const CloseWindow = () => {
  window.close();
  return <div />;
};

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home = ({ headerHeight }: OwnProps) => (
  <ErrorBoundary>
    <div className={styles.content} style={{ margin: `${headerHeight}px auto 0` }}>
      <SentryRoutes>
        <Route path="/" element={<FagsakSearchIndex />} />
        <Route path={fagsakRoutePath} element={<FagsakIndex />} />
        <Route path="/close" element={<CloseWindow />} />
        <Route path="*" element={<NotFoundPage />} />
      </SentryRoutes>
    </div>
  </ErrorBoundary>
);

export default Home;
