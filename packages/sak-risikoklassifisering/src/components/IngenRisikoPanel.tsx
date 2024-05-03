import innvilgetIkonUrl from '@k9-sak-web/assets/images/innvilget.svg';
import { Box } from '@navikt/ds-react';
import React from 'react';
import TittelMedDivider from './TittelMedDivider';
import styles from './ingenRisikoPanel.module.css';

/**
 * IngenRisikoPanel
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
const IngenRisikoPanel = () => (
  <Box background="surface-default" padding="4" className={styles.ingenRisikoOppdagetTittel}>
    <TittelMedDivider imageSrc={innvilgetIkonUrl} tittel="Risikopanel.Tittel.IngenFaresignaler" />
  </Box>
);

export default IngenRisikoPanel;
