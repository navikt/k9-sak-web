import { findEndpointsForMicrofrontend, httpErrorHandler as httpErrorHandlerFn } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import React from 'react';
import { Inntektsmelding } from '@k9-sak-web/fakta-inntektsmelding';

export default ({
  behandling,
  readOnly,
  arbeidsgiverOpplysningerPerId,
  dokumenter,
  aksjonspunkter,
  submitCallback,
}) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandlerFn(status, addErrorMessage, locationHeader);

  const løsAksjonspunkt = aksjonspunktArgs => submitCallback([{ ...aksjonspunktArgs }]);

  return (
    <Inntektsmelding
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        arbeidsforhold: arbeidsgiverOpplysningerPerId,
        dokumenter,
        readOnly,
        onFinished: løsAksjonspunkt,
        endpoints: findEndpointsForMicrofrontend(behandling.links, [
          { rel: 'kompletthet-beregning', desiredName: 'kompletthetBeregning' },
        ]),
        aksjonspunkter,
      }}
    />
  );
};
