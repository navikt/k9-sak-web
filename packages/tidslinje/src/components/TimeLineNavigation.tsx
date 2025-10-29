import { HGrid } from '@navikt/ds-react';
import { MouseEvent } from 'react';
import TimeLineButton from './TimeLineButton';

const TimeLineNavigation = ({
  openPeriodInfo,
  className,
}: {
  openPeriodInfo: (event: MouseEvent) => void;
  className?: string;
}) => {

  return (
    <HGrid gap="space-4" columns={{ xs: '11fr 1fr' }} className={className}>
      <div />
      <div>
        <TimeLineButton
          text={"Åpne info om første periode"}
          type="openData"
          callback={openPeriodInfo}
        />
      </div>
    </HGrid>
  );
};

export default TimeLineNavigation;
