import React from 'react';
import { Periode } from '@k9-sak-web/types';
import { DateLabel } from '@fpsak-frontend/shared-components';

const getFormattedPerioder = (søknadsperioder: Periode[]) =>
  søknadsperioder?.map((periode, index) => (
    <React.Fragment key={`${periode.fom}_${periode.tom}`}>
      {index > 0 && ', '}
      <DateLabel dateString={periode.fom} />
      {` - `}
      <DateLabel dateString={periode.tom} />
    </React.Fragment>
  ));

export default getFormattedPerioder;
