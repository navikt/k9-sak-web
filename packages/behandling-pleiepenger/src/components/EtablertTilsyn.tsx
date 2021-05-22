import { MicroFrontend } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import * as React from 'react';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import httpErrorHandlerFn from '../microfrontend/utils/httpErrorHandler';

const initializeEtablertTilsynApp = (elementId, httpErrorHandler, endpoints: SimpleEndpoints, readOnly) => {
  (window as any).renderTilsynApp(elementId, {
    httpErrorHandler,
    readOnly,
    endpoints,
  });
};

const etablertTilsynAppId = 'etablertTilsynApp';
export default ({ behandling, readOnly }) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandlerFn(status, addErrorMessage, locationHeader);

  return (
    <MicroFrontend
      id={etablertTilsynAppId}
      jsSrc="http://localhost:8081/main.js"
      jsIntegrity=""
      stylesheetSrc="http://localhost:8081/styles.css"
      stylesheetIntegrity=""
      onReady={() =>
        initializeEtablertTilsynApp(
          etablertTilsynAppId,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(behandling.links, [
            { rel: 'pleiepenger-sykt-barn-tilsyn', desiredName: 'tilsyn' }, // TODO: Riktig rel
          ]),
          readOnly,
        )
      }
    />
  );
};
