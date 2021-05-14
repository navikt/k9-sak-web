import * as React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { ArbeidsgiverOpplysningerPerId, Dokument, NavAnsatt } from '@k9-sak-web/types';
import { MicroFrontend } from '@fpsak-frontend/utils';
import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import httpErrorHandlerFn from '../microfrontend/utils/httpErrorHandler';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';

const initializeInntektsmeldingApp = (
  elementId,
  httpErrorHandler,
  endpoints: SimpleEndpoints,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
  readOnly,
) => {
  (window as any).renderKompletthetApp(elementId, {
    httpErrorHandler,
    arbeidsforhold,
    readOnly,
    endpoints,
  });
};

const inntektsmeldingAppId = 'medisinskVilkårApp';
export default ({ behandling, readOnly, arbeidsgiverOpplysningerPerId }) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandlerFn(status, addErrorMessage, locationHeader);

  return (
    <MicroFrontend
      id={inntektsmeldingAppId}
      jsSrc="http://localhost:8081/main.js"
      jsIntegrity=""
      stylesheetSrc="http://localhost:8081/styles.css"
      stylesheetIntegrity=""
      onReady={() =>
        initializeInntektsmeldingApp(
          inntektsmeldingAppId,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(behandling.links, [
            { rel: 'kompletthet-beregning', desiredName: 'kompletthetBeregning' },
          ]),
          arbeidsgiverOpplysningerPerId,
          readOnly,
        )
      }
    />
  );
};
