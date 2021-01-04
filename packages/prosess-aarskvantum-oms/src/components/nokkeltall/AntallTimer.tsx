import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const AntallTimer: React.FunctionComponent<{ timer?: number }> = ({ timer }) =>
  timer ? <FormattedMessage id="Nøkkeltall.Timer" values={{ timer }} /> : null;

export default AntallTimer;
