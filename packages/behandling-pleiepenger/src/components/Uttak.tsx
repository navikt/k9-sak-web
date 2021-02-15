import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import SimpleLink from '../microfrontend/types/SimpleLink';

const initializeUttak = (elementId, endpoints: SimpleEndpoints, behandlingUuid: string) => {
  (window as any).renderUttakApp(elementId, {
    endpoints,
    behandlingUuid,
  });
};

interface UttakProps {
  behandling: { links: SimpleLink[]; uuid: string };
}

const uttakAppID = 'uttakApp';
export default ({ behandling: { uuid } }: UttakProps) => {
  return (
    <MicroFrontend
      id={uttakAppID}
      jsSrc="http://localhost:8081/main.js"
      jsIntegrity="sha384-iNIBcJsYevOG/6mMde96Zy76+n0IarHJehHRWuBmVxn6fGK5sHlm4fRVIeLyXp3S"
      stylesheetSrc="http://localhost:8081/styles.css"
      stylesheetIntegrity="sha384-Ns3um5ypN0Dx4jWK7OT/rD9piP7up1qj4/bP3AYwhQtLHhc2SOMBTStumAyR0IXu"
      onReady={() => initializeUttak(uttakAppID, {}, uuid)}
      onError={() => {}}
    />
  );
};
