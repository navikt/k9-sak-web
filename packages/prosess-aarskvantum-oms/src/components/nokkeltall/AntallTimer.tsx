import React from 'react';

const AntallTimer = ({ timer }: { timer?: number }) =>
  timer ? `{timer}t` : null;

export default AntallTimer;
