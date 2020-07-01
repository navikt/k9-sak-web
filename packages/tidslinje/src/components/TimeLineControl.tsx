import React, { FunctionComponent, ReactNode, MouseEvent } from 'react';
import { Row } from 'nav-frontend-grid';
import { useIntl } from 'react-intl';
import TimeLineButton from './TimeLineButton';
import styles from './timeLineControl.less';

interface TimeLineControlProps {
  children?: ReactNode;
  goBackwardCallback: (event: MouseEvent) => void;
  goForwardCallback: (event: MouseEvent) => void;
  openPeriodInfo: (event: MouseEvent) => void;
  selectedPeriod?: any;
  zoomInCallback: (event: MouseEvent) => void;
  zoomOutCallback: (event: MouseEvent) => void;
}

/*
 * Timeline controller
 *
 * Holds the controls for the timeline (zoom, traversing left/right and opening the data area)
 */
const TimeLineControl: FunctionComponent<TimeLineControlProps> = ({
  children,
  goBackwardCallback,
  goForwardCallback,
  openPeriodInfo,
  selectedPeriod,
  zoomInCallback,
  zoomOutCallback,
}) => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <Row>
        <div className={styles.scrollButtonContainer}>
          {children}
          <TimeLineButton
            inverted={selectedPeriod !== undefined}
            text={formatMessage({ id: 'Timeline.openData' })}
            type="openData"
            callback={openPeriodInfo}
          />
          <span className={styles.buttonSpacing}>
            <TimeLineButton text={formatMessage({ id: 'Timeline.zoomIn' })} type="zoomIn" callback={zoomInCallback} />
            <TimeLineButton
              text={formatMessage({ id: 'Timeline.zoomOut' })}
              type="zoomOut"
              callback={zoomOutCallback}
            />
          </span>
          <TimeLineButton
            text={formatMessage({ id: 'Timeline.prevPeriod' })}
            type="prev"
            callback={goBackwardCallback}
          />
          <TimeLineButton
            text={formatMessage({ id: 'Timeline.nextPeriod' })}
            type="next"
            callback={goForwardCallback}
          />
        </div>
      </Row>
    </div>
  );
};

export default TimeLineControl;
