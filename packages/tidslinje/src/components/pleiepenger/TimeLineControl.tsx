import React, { FunctionComponent, ReactNode, MouseEvent } from 'react';
import { Row } from 'nav-frontend-grid';
import styles from './timeLineControl.less';
import TimeLineButton from '../TimeLineButton';

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

const TimeLineControl: FunctionComponent<TimeLineControlProps> = ({
  children,
  goBackward,
  goForward,
  zoomIn,
  zoomOut,
}) => (
  <Row>
    <div className={styles.scrollButtonContainer}>
      {children}
      <span className={styles.buttonSpacing}>
        <TimeLineButton text={zoomIn.buttonText} type="zoomIn" callback={zoomIn.callback} />
        <TimeLineButton text={zoomOut.buttonText} type="zoomOut" callback={zoomOut.callback} />
      </span>
      <TimeLineButton text={goBackward.buttonText} type="prev" callback={goBackward.callback} />
      <TimeLineButton text={goForward.buttonText} type="next" callback={goForward.callback} />
    </div>
  </Row>
);

export default TimeLineControl;
