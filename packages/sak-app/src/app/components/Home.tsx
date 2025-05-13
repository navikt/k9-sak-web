import * as Sentry from '@sentry/react';
import { Route, Routes } from 'react-router';

import NotFoundPage from '@k9-sak-web/gui/app/feilmeldinger/NotFoundPage.js';

import AktoerIndex from '../../aktoer/AktoerIndex';
import FagsakIndex from '../../fagsak/FagsakIndex';
import { aktoerRoutePath, fagsakRoutePath } from '../paths';

import { UnhandledRejectionCatcher } from '@k9-sak-web/gui/app/UnhandledRejectionCatcher.js';
import styles from './home.module.css';
import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';

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
      {/* OBS: AktoerRoutePath brukes av NKS fra Salesforce til K9-sak-web. Kanskje andre også */}
      <Route path={aktoerRoutePath} element={<AktoerIndex />} />
      <Route path="/close" element={<CloseWindow />} />
      <Route path="*" element={<NotFoundPage />} />
    </SentryRoutes>
  </div>
);

export default Home;
