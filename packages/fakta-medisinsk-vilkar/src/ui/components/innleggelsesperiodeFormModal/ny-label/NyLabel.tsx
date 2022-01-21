import { ContentWithTooltip } from '@navikt/k9-react-components';
import * as React from 'react';
import styles from './nyLabel.less';

const NyLabel = (): JSX.Element => (
    <div className={styles.nyLabel__container}>
        <ContentWithTooltip tooltipText="Ny periode lagt til nå">
            <div className={styles.nyLabel__icon}>Ny</div>
        </ContentWithTooltip>
    </div>
);

export default NyLabel;
