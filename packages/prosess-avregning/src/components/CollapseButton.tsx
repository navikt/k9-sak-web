import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './collapseButton.module.css';

const buttonText = showDetails =>
  showDetails ? 'Avregning.headerText.VisFærreDetaljer' : 'Avregning.headerText.VisFlereDetaljer';

interface CollapseButtonProps {
  toggleDetails(...args: unknown[]): unknown;
  showDetails: boolean;
  mottakerIndex: number;
}

const CollapseButton = ({ toggleDetails, showDetails, mottakerIndex }: CollapseButtonProps) => (
  <button type="button" className={styles.invisibleButton} onClick={() => toggleDetails(mottakerIndex)}>
    <FormattedMessage id={buttonText(showDetails)} />
    {showDetails ? <OppChevron /> : <NedChevron />}
  </button>
);

export default CollapseButton;
