import Panel from 'nav-frontend-paneler';
import React from 'react';

import innvilgetIkonUrl from '@fpsak-frontend/assets/images/innvilget.svg?react';

import TittelMedDivider from './TittelMedDivider';

import styles from './ingenRisikoPanel.module.css';

/**
 * IngenRisikoPanel
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
const IngenRisikoPanel = () => (
  <Panel className={styles.ingenRisikoOppdagetTittel}>
    <TittelMedDivider imageSrc={innvilgetIkonUrl} tittel="Risikopanel.Tittel.IngenFaresignaler" />
  </Panel>
);

export default IngenRisikoPanel;
