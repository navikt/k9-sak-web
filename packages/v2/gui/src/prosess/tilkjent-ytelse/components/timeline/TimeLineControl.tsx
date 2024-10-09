import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ZoomMinusIcon,
  ZoomPlusIcon,
} from '@navikt/aksel-icons';
import { Button, HGrid, HStack } from '@navikt/ds-react';
import type { MouseEventHandler } from 'react';

interface TimeLineControlProps {
  goBackwardCallback: MouseEventHandler<HTMLButtonElement>;
  goForwardCallback: MouseEventHandler<HTMLButtonElement>;
  openPeriodInfo: MouseEventHandler<HTMLButtonElement>;
  selectedPeriod?: any;
  zoomInCallback: MouseEventHandler<HTMLButtonElement>;
  zoomOutCallback: MouseEventHandler<HTMLButtonElement>;
}

/*
 * Timeline controller
 *
 * Holds the controls for the timeline (zoom, traversing left/right and opening the data area)
 */
const TimeLineControl = ({
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
        <HStack gap="1" className="float-right mt-2 mb-2">
          <Button
            variant="secondary"
            size="xsmall"
            type="button"
            icon={
              selectedPeriod ? (
                <ChevronUpIcon title="Åpne info om første periode" fontSize="1.5rem" />
              ) : (
                <ChevronDownIcon title="Åpne info om første periode" fontSize="1.5rem" />
              )
            }
            onClick={openPeriodInfo}
          />

          <Button
            variant="secondary"
            size="xsmall"
            type="button"
            icon={<ZoomPlusIcon title="Zoom inn" fontSize="1.5rem" />}
            onClick={zoomInCallback}
          />
          <Button
            variant="secondary"
            size="xsmall"
            type="button"
            icon={<ZoomMinusIcon title="Zoom ut" fontSize="1.5rem" />}
            onClick={zoomOutCallback}
          />

          <Button
            variant="secondary"
            size="xsmall"
            type="button"
            icon={<ChevronLeftIcon title="Forrige periode" fontSize="1.5rem" />}
            onClick={goBackwardCallback}
          />
          <Button
            variant="secondary"
            size="xsmall"
            type="button"
            icon={<ChevronRightIcon title="Neste periode" fontSize="1.5rem" />}
            onClick={goForwardCallback}
          />
        </HStack>
      </div>
    </HGrid>
  );
};

export default TimeLineControl;
