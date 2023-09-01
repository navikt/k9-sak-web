import { Pin } from '@k9-sak-web/types/src/tidslinje';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import styles from './Pins.css';
import Tooltip from './Tooltip';
import { position } from './calc';

const PinView = ({ render, classname }: Partial<Pin>) => {
  const [showRender, setShowRender] = useState(false);
  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div
      className={`${styles.pin} ${classname} pin`}
      onMouseOver={() => setShowRender(true)}
      onMouseLeave={() => setShowRender(false)}
    >
      {showRender && render && <Tooltip className={styles.tooltip}>{render}</Tooltip>}
    </div>
  );
};

interface PinsProps {
  pins: Pin[];
  start: Dayjs;
  slutt: Dayjs;
  direction: 'left' | 'right';
}

const Pins = ({ pins, start, slutt, direction }: PinsProps) => (
  <div className={styles.pins}>
    {pins.map(({ date, render, classname }, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={i} className={styles.container} style={{ [direction]: `${position(dayjs(date), start, slutt)}%` }}>
        <PinView render={render} classname={classname} />
      </span>
    ))}
  </div>
);

export default Pins;
