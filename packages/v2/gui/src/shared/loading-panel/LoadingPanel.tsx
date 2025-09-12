import { Loader } from '@navikt/ds-react';
import styles from './loadingPanel.module.css';

/**
 * LoadingPanel
 *
 * Presentasjonskomponent. Viser lasteikon.
 */
export const LoadingPanel = () => (
  <div className={styles.container}>
    <Loader className="loader" variant="neutral" size="2xlarge" title="venter..." />
  </div>
);
