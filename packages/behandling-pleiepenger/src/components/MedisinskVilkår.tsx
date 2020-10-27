import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';

const initializeMedisinskVilkår = elementId => {
  (window as any).renderMedisinskVilkarApp(elementId);
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default () => {
  return (
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.1.4/app.js"
      jsIntegrity="sha384-acy0SAKC8p7AfoxfKGNCVhcFakJf7jLOFazP+Mb3KAlZI6M4cM5xRwNCY8IIVLOS"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.1.4/styles.css"
      stylesheetIntegrity="sha384-Xk8niKwPSn6MuJY6a2phDMit6VMjbZicWSgMm9CcVX7GOOJ/05NSWdTmL8272sHN"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
