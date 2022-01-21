import { ContentWithTooltip, ExclamationMarkIcon } from '@navikt/k9-react-components';
import * as React from 'react';
import styles from './slettetLabel.less';

const SlettetLabel = (): JSX.Element => (
    <div className={styles.slettetLabel__container}>
        <ContentWithTooltip tooltipText="Slettet">
            <ExclamationMarkIcon />
        </ContentWithTooltip>
    </div>
);

export default SlettetLabel;
