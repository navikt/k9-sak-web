import NotFoundPage from '@k9-sak-web/gui/app/feilmeldinger/NotFoundPage.js';
import { UnhandledRejectionCatcher } from '@k9-sak-web/gui/app/UnhandledRejectionCatcher.js';
import * as Sentry from '@sentry/react';
import { Route, Routes } from 'react-router';
import FagsakIndex from '../../fagsak/FagsakIndex';
import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';
import { fagsakRoutePath } from '../paths';
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

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home = ({ headerHeight }: OwnProps) => (
  <div className={styles.content} style={{ margin: `${headerHeight}px auto 0` }}>
    <UnhandledRejectionCatcher />
    <SentryRoutes>
      <Route path="/" element={<FagsakSearchIndex />} />
      <Route path={fagsakRoutePath} element={<FagsakIndex />} />
      <Route path="/close" element={<CloseWindow />} />
      <Route path="*" element={<NotFoundPage />} />
    </SentryRoutes>
  </div>
);

export default Home;
