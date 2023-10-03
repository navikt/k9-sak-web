import Panel from 'nav-frontend-paneler';
import React from 'react';

import manglendeKlassifiseringIkon from '@fpsak-frontend/assets/images/behandle_disable.svg';

import TittelMedDivider from './TittelMedDivider';

import styles from './manglendeKlassifiseringPanel.module.css';

/**
 * ManglendeKlassifiseringPanel
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen risikoklassifisering er utført for valgt behandling, eller at ingen behandling er valgt.
 */
const ManglendeKlassifiseringPanel = () => (
  <Panel className={styles.ingenKlassifiseringUtfortTittel}>
    <TittelMedDivider imageSrc={manglendeKlassifiseringIkon} tittel="Risikopanel.Tittel.ManglerKlassifisering" />
  </Panel>
);

export default ManglendeKlassifiseringPanel;
