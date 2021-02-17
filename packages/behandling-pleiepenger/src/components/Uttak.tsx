import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import SimpleLink from '../microfrontend/types/SimpleLink';
import httpErrorHandler from '../microfrontend/utils/httpErrorHandler';

const initializeUttak = (elementId, httpErrorHandlerFn, endpoints: SimpleEndpoints, behandlingUuid: string) => {
  (window as any).renderUttakApp(elementId, {
    endpoints,
    behandlingUuid,
    httpErrorHandler: httpErrorHandlerFn,
  });
};

interface UttakProps {
  behandling: { links: SimpleLink[]; uuid: string };
}

const uttakAppID = 'uttakApp';
export default ({ behandling: { uuid } }: UttakProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  return (
    <MicroFrontend
      id={uttakAppID}
      jsSrc="https://psb-uttak-frontend.dev.adeo.no/1.0.0/app.js"
      jsIntegrity="sha384-87KkPGQWjv7I8MsnyJGCCJe4Hr18c49plIz7Gjrh6aAxuJr/wp5gwsS/YlRQHVIV"
      stylesheetSrc="https://psb-uttak-frontend.dev.adeo.no/1.0.0/styles.css"
      stylesheetIntegrity="sha384-2O4j2h5tlOwrNzSQmVuPLaNvhoYT70nyFwSrnTMrRss3oJwAHlg+sSxbnZAFRFUF"
      onReady={() => initializeUttak(uttakAppID, httpErrorHandlerCaller, {}, uuid)}
    />
  );
};
