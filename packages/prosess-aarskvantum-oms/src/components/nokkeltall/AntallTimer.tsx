import React from 'react';

const AntallTimer = ({ timer }: { timer?: number }) =>
  timer ? <FormattedMessage id="Nøkkeltall.Timer" values={{ timer }} /> : null;

export default AntallTimer;
