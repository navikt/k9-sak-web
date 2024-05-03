import { Period } from '@k9-sak-web/utils';
import { CalendarIcon } from '@navikt/ft-plattform-komponenter';
import classnames from 'classnames';
import * as React from 'react';
import styles from './periodList.module.css';

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
      <span className={styles.periodList__periods}>{periods.map(period => period.prettifyPeriod()).join(', ')}</span>
    </div>
  );
};
export default PeriodList;
