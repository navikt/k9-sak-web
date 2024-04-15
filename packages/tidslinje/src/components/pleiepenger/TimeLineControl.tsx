import React, { MouseEvent, ReactNode } from 'react';
import TimeLineButton from '../TimeLineButton';
import styles from './timeLineControl.module.css';

interface ButtonCallback {
  callback: (event: MouseEvent) => void;
  buttonText: string;
}

interface TimeLineControlProps {
  children?: ReactNode;
  goBackward: ButtonCallback;
  goForward: ButtonCallback;
  zoomIn: ButtonCallback;
  zoomOut: ButtonCallback;
}

const TimeLineControl = ({ children, goBackward, goForward, zoomIn, zoomOut }: TimeLineControlProps) => (
  <div className={styles.scrollButtonContainer}>
    {children}
    <span className={styles.buttonSpacing}>
      <TimeLineButton text={zoomIn.buttonText} type="zoomIn" callback={zoomIn.callback} />
      <TimeLineButton text={zoomOut.buttonText} type="zoomOut" callback={zoomOut.callback} />
    </span>
    <TimeLineButton text={goBackward.buttonText} type="prev" callback={goBackward.callback} />
    <TimeLineButton text={goForward.buttonText} type="next" callback={goForward.callback} />
  </div>
);

export default TimeLineControl;
