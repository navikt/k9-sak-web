import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import HeaderWithErrorPanel from '@fpsak-frontend/sak-dekorator';
import { useState } from '@storybook/addons';

export default {
  title: 'sak/sak-dekoratør',
  component: HeaderWithErrorPanel,
  decorators: [withKnobs],
};

export const visDekoratorUtenFeilmeldinger = () => (
  <div style={{ marginLeft: '-56px' }}>
    <HeaderWithErrorPanel
      navAnsattName="Espen Utvikler"
      removeErrorMessage={() => undefined}
      setSiteHeight={() => undefined}
      getPathToFplos={() => undefined}
      getPathToK9Punsj={() => undefined}
    />
  </div>
);

export const visDekoratorMedFeilmeldinger = () => {
  const [errorMessages, removeErrorMessages] = useState([{ message: 'Feilmelding 1' }, { message: 'Feilmelding 2' }]);
  return (
    <div style={{ marginLeft: '-56px' }}>
      <HeaderWithErrorPanel
        navAnsattName="Espen Utvikler"
        removeErrorMessage={() => removeErrorMessages([])}
        setSiteHeight={() => undefined}
        getPathToFplos={() => undefined}
        errorMessages={errorMessages}
        getPathToK9Punsj={() => undefined}
      />
    </div>
  );
};
