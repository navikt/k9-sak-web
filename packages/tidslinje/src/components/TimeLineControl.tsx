import { HGrid } from '@navikt/ds-react';
import { MouseEvent, ReactNode } from 'react';
import TimeLineButton from './TimeLineButton';
import styles from './timeLineControl.module.css';

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
const TimeLineControl = ({
  children,
  goBackwardCallback,
  goForwardCallback,
  openPeriodInfo,
  selectedPeriod,
  zoomInCallback,
  zoomOutCallback,
}: TimeLineControlProps) => {
  return (
    <HGrid gap="1" columns={{ xs: '12fr' }}>
      <div>
        <div className={styles.scrollButtonContainer}>
          {children}
          <TimeLineButton
            inverted={selectedPeriod !== undefined}
            text="Åpne info om første periode"
            type="openData"
            callback={openPeriodInfo}
          />
          <span className={styles.buttonSpacing}>
            <TimeLineButton text="Zoom inn" type="zoomIn" callback={zoomInCallback} />
            <TimeLineButton text="Zoom ut" type="zoomOut" callback={zoomOutCallback} />
          </span>
          <TimeLineButton text="Forrige periode" type="prev" callback={goBackwardCallback} />
          <TimeLineButton text="Neste periode" type="next" callback={goForwardCallback} />
        </div>
      </div>
    </HGrid>
  );
};

export default TimeLineControl;
