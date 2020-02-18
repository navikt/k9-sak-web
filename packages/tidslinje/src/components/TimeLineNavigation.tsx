import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { useIntl } from 'react-intl';
import EventCallback from '@k9-sak-web/types/src/EventCallback';
import TimeLineButton from './TimeLineButton';

const TimeLineNavigation: FunctionComponent<{ openPeriodInfo: EventCallback }> = ({ openPeriodInfo }) => {
  const intl = useIntl();
  return (
    <Row>
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

TimeLineNavigation.propTypes = {
  openPeriodInfo: PropTypes.func.isRequired,
};

export default TimeLineNavigation;
