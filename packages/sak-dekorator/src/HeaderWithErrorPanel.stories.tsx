import { useState } from 'react';
import HeaderWithErrorPanel from './HeaderWithErrorPanel';

export default {
  title: 'sak/sak-dekoratør',
  component: HeaderWithErrorPanel,
};

export const visDekoratorUtenFeilmeldinger = () => (
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
);

export const visDekoratorMedFeilmeldinger = () => {
  const [errorMessages, removeErrorMessages] = useState([
    { message: 'Feilmelding 1' },
    {
      message: 'En lang feilmelding som også har ekstra informasjon som kan åpnes i en popup.',
      additionalInfo: { feilmelding: 'Detaljert feilmelding', url: '' },
    },
  ]);
  return (
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
  );
};
