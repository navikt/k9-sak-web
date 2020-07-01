import React, { FunctionComponent, MouseEvent } from 'react';
import { Column, Row } from 'nav-frontend-grid';

import { useIntl } from 'react-intl';
import TimeLineButton from './TimeLineButton';

const TimeLineNavigation: FunctionComponent<{ openPeriodInfo: (event: MouseEvent) => void; className?: string }> = ({
  openPeriodInfo,
  className,
}) => {
  const intl = useIntl();
  return (
    <Row className={className}>
      <Column xs="11" />
      <Column xs="1">
        <TimeLineButton
          text={intl.formatMessage({ id: 'Timeline.openData' })}
          type="openData"
          callback={openPeriodInfo}
        />
      </Column>
    </Row>
  );
};

export default TimeLineNavigation;
