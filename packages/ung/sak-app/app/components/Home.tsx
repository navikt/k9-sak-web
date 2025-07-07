import * as Sentry from '@sentry/react';
import { Route, Routes } from 'react-router';

import NotFoundPage from '@k9-sak-web/gui/app/feilmeldinger/NotFoundPage.js';

import FagsakIndex from '../../fagsak/FagsakIndex';
import { fagsakRoutePath } from '../paths';

import { UnhandledRejectionCatcher } from '@k9-sak-web/gui/app/UnhandledRejectionCatcher.js';
import styles from './home.module.css';
import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';
import { ErrorProvider } from '@k9-sak-web/gui/app/alerts/ErrorContext.js';

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
  <div className={styles.content} style={{ margin: `${headerHeight}px auto 0` }}>
    <ErrorProvider>
      <UnhandledRejectionCatcher />
      <SentryRoutes>
        <Route path="/" element={<FagsakSearchIndex />} />
        <Route path={fagsakRoutePath} element={<FagsakIndex />} />
        <Route path="/close" element={<CloseWindow />} />
        <Route path="*" element={<NotFoundPage />} />
      </SentryRoutes>
    </ErrorProvider>
  </div>
);

export default Home;
