import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { NotFoundPage } from '@k9-sak-web/sak-infosider';

import AktoerIndex from '../../aktoer/AktoerIndex';
import FagsakIndex from '../../fagsak/FagsakIndex';
import { aktoerRoutePath, fagsakRoutePath } from '../paths';
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
      <Route path="/close" element={<CloseWindow />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </div>
);

export default Home;
