import type { Period } from '@fpsak-frontend/utils';
import { CalendarIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import type { JSX } from 'react';
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
        <CalendarIcon fontSize="1.5rem" />
      </div>
      <span className={styles.periodList__periods}>{periods.map(period => period.prettifyPeriod()).join(', ')}</span>
    </div>
  );
};
export default PeriodList;
