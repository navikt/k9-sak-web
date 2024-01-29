import { ContentWithTooltip, ExclamationMarkIcon } from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import styles from './slettetLabel.module.css';

const SlettetLabel = (): JSX.Element => (
  <div className={styles.slettetLabel__container}>
    <ContentWithTooltip tooltipText="Slettet">
      <ExclamationMarkIcon />
    </ContentWithTooltip>
  </div>
);

export default SlettetLabel;
