import manglendeKlassifiseringIkon from '@k9-sak-web/assets/images/behandle_disable.svg';
import { Box } from '@navikt/ds-react';
import React from 'react';
import TittelMedDivider from './TittelMedDivider';
import styles from './manglendeKlassifiseringPanel.module.css';

/**
 * ManglendeKlassifiseringPanel
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen risikoklassifisering er utført for valgt behandling, eller at ingen behandling er valgt.
 */
const ManglendeKlassifiseringPanel = () => (
  <Box background="surface-default" padding="4" className={styles.ingenKlassifiseringUtfortTittel}>
    <TittelMedDivider imageSrc={manglendeKlassifiseringIkon} tittel="Risikopanel.Tittel.ManglerKlassifisering" />
  </Box>
);

export default ManglendeKlassifiseringPanel;
