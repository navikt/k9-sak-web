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
      jsSrc="https://medisinsk-vilkar-frontend.dev.adeo.no/1.0.5/app.js"
      jsIntegrity="sha384-0Pe12ZEVxOKf8QBu7ELWNNSBV3kOByyQVkGmRHRiwr6hW9IPS2iUQlKIWdCIVwos"
      stylesheetSrc="https://medisinsk-vilkar-frontend.dev.adeo.no/1.0.5/styles.css"
      stylesheetIntegrity="sha384-pcc0nZEnb08jMuxXkCc2evZ98N4xhD2Pusa5oUUOoKXCe0bCu/wtMCYAngdZXpqu"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
