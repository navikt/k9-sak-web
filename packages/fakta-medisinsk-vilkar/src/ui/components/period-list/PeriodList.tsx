import { Period } from '@navikt/k9-period-utils';
import { CalendarIcon } from '@navikt/k9-react-components';
import * as React from 'react';
import classnames from 'classnames';
import styles from './periodList.less';

interface PeriodListProps {
    periods: Period[];
    className?: string;
}

const PeriodList = ({ periods, className }: PeriodListProps): JSX.Element => {
    const cls = classnames(styles.periodList, {
        [className]: !!className,
    });
    return (
        <div className={cls}>
            <div className={styles.periodList__calendarIcon}>
                <CalendarIcon />
            </div>
            <span className={styles.periodList__periods}>
                {periods.map((period) => period.prettifyPeriod()).join(', ')}
            </span>
        </div>
    );
};
export default PeriodList;
