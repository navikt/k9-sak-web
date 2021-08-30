import React, { MouseEvent } from 'react';
import { Column, Row } from 'nav-frontend-grid';

import { useIntl } from 'react-intl';
import TimeLineButton from './TimeLineButton';

const TimeLineNavigation = ({
  openPeriodInfo,
  className,
}: {
  openPeriodInfo: (event: MouseEvent) => void;
  className?: string;
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
