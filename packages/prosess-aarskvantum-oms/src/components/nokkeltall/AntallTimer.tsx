import React from 'react';
import { FormattedMessage } from 'react-intl';

const AntallTimer = ({ timer }: { timer?: number }) =>
  timer ? <FormattedMessage id="Nøkkeltall.Timer" values={{ timer }} /> : null;

export default AntallTimer;
