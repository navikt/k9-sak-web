import { findEndpointsForMicrofrontend, httpErrorHandler as httpErrorHandlerFn } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Inntektsmelding } from '@navikt/k9-fe-inntektsmelding';
import React from 'react';

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
        saksbehandlere: saksbehandlere || {},
        aksjonspunkter,
      }}
    />
  );
};
