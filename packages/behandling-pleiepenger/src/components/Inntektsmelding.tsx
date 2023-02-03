import React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { ArbeidsgiverOpplysningerPerId, Dokument, SimpleEndpoints } from '@k9-sak-web/types';
import {
  MicroFrontend,
  httpErrorHandler as httpErrorHandlerFn,
  findEndpointsForMicrofrontend,
} from '@fpsak-frontend/utils';

const initializeInntektsmeldingApp = (
  elementId,
  httpErrorHandler,
  endpoints: SimpleEndpoints,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
  dokumenter: Dokument[],
  løsAksjonspunkt,
  readOnly,
  saksbehandlere,
  aksjonspunkter,
) => {
  (window as any).renderKompletthetApp(elementId, {
    httpErrorHandler,
    arbeidsforhold,
    dokumenter,
    readOnly,
    onFinished: løsAksjonspunkt,
    endpoints,
    saksbehandlere,
    aksjonspunkter,
  });
};

const inntektsmeldingAppId = 'inntektsmeldingApp';
export default ({
  behandling,
  readOnly,
  arbeidsgiverOpplysningerPerId,
  dokumenter,
  aksjonspunkter,
  submitCallback,
  saksbehandlere,
}) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandlerFn(status, addErrorMessage, locationHeader);

  const løsAksjonspunkt = aksjonspunktArgs => submitCallback([{ ...aksjonspunktArgs }]);
  return (
    <MicroFrontend
      id={inntektsmeldingAppId}
      jsSrc="/k9/microfrontend/psb-inntektsmelding/1/app.js"
      stylesheetSrc="/k9/microfrontend/psb-inntektsmelding/1/styles.css"
      noCache
      onReady={() =>
        initializeInntektsmeldingApp(
          inntektsmeldingAppId,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(behandling.links, [
            { rel: 'kompletthet-beregning', desiredName: 'kompletthetBeregning' },
          ]),
          arbeidsgiverOpplysningerPerId,
          dokumenter,
          løsAksjonspunkt,
          readOnly,
          saksbehandlere || {},
          aksjonspunkter,
        )
      }
    />
  );
};
