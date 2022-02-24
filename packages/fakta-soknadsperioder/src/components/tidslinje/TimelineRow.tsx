import React from 'react';
import classNames from 'classnames';
import styles from './Tidslinjerad.less';
import TimelinePeriod from './TimelinePeriod';
import { PositionedPeriod } from '../../types/types.internal';

interface TimelineRowProps {
  periods: PositionedPeriod[];
  onSelectPeriod?: (periode: PositionedPeriod) => void;
  active?: boolean;
}

export const EmptyTimelineRow = ({ className }) => <hr className={`${styles.emptyRow} ${className || ''}`} />;

export const TimelineRow = ({ periods, onSelectPeriod, active = false }: TimelineRowProps) => (
  <div className={classNames('tidslinjerad', styles.perioder, active && styles.aktivRad)}>
    {periods.map(period => (
      <TimelinePeriod key={period.id} period={period} onSelectPeriod={onSelectPeriod} active={period.active} />
    ))}
  </div>
);
