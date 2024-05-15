import React, { useState } from 'react';
import { MemoryRouter } from 'react-router';
import HeaderWithErrorPanel from './HeaderWithErrorPanel';

export default {
  title: 'sak/sak-dekoratør',
  component: HeaderWithErrorPanel,
};

export const visDekoratorUtenFeilmeldinger = () => (
  <MemoryRouter>
    <div style={{ marginLeft: '-56px' }}>
      <HeaderWithErrorPanel
        navAnsattName="Espen Utvikler"
        removeErrorMessage={() => undefined}
        setSiteHeight={() => undefined}
        getPathToFplos={() => undefined}
        getPathToK9Punsj={() => undefined}
        ainntektPath="test"
        aaregPath="test"
      />
    </div>
  </MemoryRouter>
);

export const visDekoratorMedFeilmeldinger = () => {
  const [errorMessages, removeErrorMessages] = useState([{ message: 'Feilmelding 1' }, { message: 'Feilmelding 2' }]);
  return (
    <MemoryRouter>
      <div style={{ marginLeft: '-56px' }}>
        <HeaderWithErrorPanel
          navAnsattName="Espen Utvikler"
          removeErrorMessage={() => removeErrorMessages([])}
          setSiteHeight={() => undefined}
          getPathToFplos={() => undefined}
          errorMessages={errorMessages}
          getPathToK9Punsj={() => undefined}
          ainntektPath="test"
          aaregPath="test"
        />
      </div>
    </MemoryRouter>
  );
};
