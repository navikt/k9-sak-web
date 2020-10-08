import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';

const initializeMedisinskVilkår = (elementId, behandling, submitCallback) => {
  (window as any).renderMedisinskVilkarApp(elementId, {
    onSubmit: submitCallback,
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default ({ behandling, submitCallback }) => {
  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="https://medisinsk-vilkar-frontend.dev.adeo.no/1.0.0/app.js"
      jsIntegrity="sha384-Cx0ZWt3Nlv09Ony0GC7wFYGTqxg9B4U9ViGnCxMoI+eY6njwkccIi0FtBgLgSXBo"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID, behandling, submitCallback)}
      onError={() => {}}
    />
  );
};
