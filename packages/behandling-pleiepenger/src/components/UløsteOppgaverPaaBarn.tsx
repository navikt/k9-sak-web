import React from 'react';
import Punsjstripe from './Punsjstripe';

const UløsteOppgaverPaaBarn = ({ barnSoektFor }): JSX.Element => {
  if (!barnSoektFor || (Array.isArray(barnSoektFor) && !barnSoektFor.length)) {
    return null;
  }
  console.log(barnSoektFor)
  return (
    <>
      {barnSoektFor.map(barn => (
        <Punsjstripe aktørId={barn?.aktoerId} />
      ))}
    </>
  );
};

export default UløsteOppgaverPaaBarn;
