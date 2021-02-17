import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import SimpleLink from '../microfrontend/types/SimpleLink';
import httpErrorHandler from '../microfrontend/utils/httpErrorHandler';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';

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
export default ({ behandling: { uuid, links } }: UttakProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  return (
    <MicroFrontend
      id={uttakAppID}
      jsSrc="https://psb-uttak-frontend.dev.adeo.no/1.0.1/app.js"
      jsIntegrity="sha384-m6thzpLVP6hFhhevI0FBGQwy31E7oaZ1Y+JNW3ta0ZZrORSdZwcgpxYLUjroLOvi"
      stylesheetSrc="https://psb-uttak-frontend.dev.adeo.no/1.0.1/styles.css"
      stylesheetIntegrity="sha384-2O4j2h5tlOwrNzSQmVuPLaNvhoYT70nyFwSrnTMrRss3oJwAHlg+sSxbnZAFRFUF"
      onReady={() =>
        initializeUttak(
          uttakAppID,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(links, [
            { rel: 'pleiepenger-sykt-barn-uttaksplan', desiredName: 'uttaksplan' },
          ]),
          uuid,
        )
      }
    />
  );
};
