import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { NotFoundPage } from '@k9-sak-web/sak-infosider';

import { aktoerRoutePath, fagsakRoutePath } from '../paths';
import FagsakIndex from '../../fagsak/FagsakIndex';
import AktoerIndex from '../../aktoer/AktoerIndex';
import DashboardResolver from './DashboardResolver';

import styles from './home.less';

interface OwnProps {
  headerHeight: number;
}

// Brukes av RequestRunner.ts for å lukke en popup som logger inn igjen ved 401
const closeWindow = () => {
  window.close();
  return <div />;
};

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home = ({ headerHeight }: OwnProps) => (
  <div className={styles.content} style={{ margin: `${headerHeight}px auto 0` }}>
    <Routes>
      <Route path="/" element={<DashboardResolver />} />
      <Route path={fagsakRoutePath} element={<FagsakIndex />} />
      <Route path={aktoerRoutePath} element={<AktoerIndex />} />
      <Route path="/close" element={closeWindow()} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </div>
);

export default Home;
