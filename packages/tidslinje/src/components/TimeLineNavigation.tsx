import { HGrid } from '@navikt/ds-react';
import React, { MouseEvent } from 'react';
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
    <HGrid gap="1" columns={{ xs: '11fr 1fr' }} className={className}>
      <div />
      <div>
        <TimeLineButton
          text={intl.formatMessage({ id: 'Timeline.openData' })}
          type="openData"
          callback={openPeriodInfo}
        />
      </div>
    </HGrid>
  );
};

export default TimeLineNavigation;
