import { Image } from '@k9-sak-web/shared-components';
import React from 'react';
import TimeLineButton from './TimeLineButton';
import styles from './legendBox.module.css';

interface LegendBoxProps {
  legends: {
    src: string;
    text: string;
  }[];
}

const LegendBox = ({ legends }: LegendBoxProps) => (
  <span className={styles.popUnder}>
    <span>
      <TimeLineButton type="question" text="Question" />
    </span>
    <div className={styles.popUnderContent}>
      <div className={styles.legendBoxContainer}>
        {legends.map(legend => (
          <div className={styles.legendBoxLegend} key={legend.text}>
            <Image className={styles.legendBoxIcon} src={legend.src} alt={legend.text} />
            <span>{legend.text}</span>
          </div>
        ))}
      </div>
    </div>
  </span>
);

export default LegendBox;
