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
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.2.5/app.js"
      jsIntegrity="sha384-/uGRdTyp2QwP9PWwBumQ+fcNDnNMqBwTvWz4dEuBkCTfMyoX7pva1vNrdTh7z4c3"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.2.5/styles.css"
      stylesheetIntegrity="sha384-ZGZZotybL/3+R0eExim0DQusuq82HK/7uMrZVZPFo8gzjwwPXw/9xzjGQZxDJAfk"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
