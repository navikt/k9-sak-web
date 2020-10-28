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
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.2.1/app.js"
      jsIntegrity="sha384-uMJ/rw/hJa1kjXeJn+xv9tSMgIzSngAy7qKXNRkdYfXB5KGFmXz5LweGf+E5HF+W"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.2.1/styles.css"
      stylesheetIntegrity="sha384-otDaVUEZxB+ebTWv/o8DBiHRSUNJk4Ya/bix5/GSky7O8j4kfzT1nqIZ0/HC+pX/"
      onReady={() => initializeMedisinskVilkår(medisinskVilkårAppID)}
      onError={() => {}}
    />
  );
};
