import React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { ArbeidsgiverOpplysningerPerId, Dokument } from '@k9-sak-web/types';
import { MicroFrontend } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import httpErrorHandlerFn from '../microfrontend/utils/httpErrorHandler';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import findAksjonspunkt from '../microfrontend/utils/findAksjonspunkt';

const initializeInntektsmeldingApp = (
  elementId,
  httpErrorHandler,
  endpoints: SimpleEndpoints,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
  dokumenter: Dokument[],
  løsAksjonspunkt,
  readOnly,
  visFortsettKnapp: boolean
) => {
  (window as any).renderKompletthetApp(elementId, {
    httpErrorHandler,
    arbeidsforhold,
    dokumenter,
    readOnly,
    onFinished: løsAksjonspunkt,
    endpoints,
    visFortsettKnapp,
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
}) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandlerFn(status, addErrorMessage, locationHeader);

  const inntektsmeldingManglerAksjonspunkt = findAksjonspunkt(
    aksjonspunkter,
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER,
  );
  const inntektsmeldingManglerAksjonspunktkode = inntektsmeldingManglerAksjonspunkt?.definisjon.kode;
  const inntektsmeldingManglerAksjonspunktstatus = inntektsmeldingManglerAksjonspunkt?.status.kode;
  const visFortsettknapp = inntektsmeldingManglerAksjonspunktstatus === aksjonspunktStatus.OPPRETTET;
  const harAksjonspunkt = !!inntektsmeldingManglerAksjonspunktkode;

  const løsAksjonspunkt = aksjonspunktArgs =>
    submitCallback([{ kode: inntektsmeldingManglerAksjonspunktkode, ...aksjonspunktArgs }]);

  return (
    <MicroFrontend
      id={inntektsmeldingAppId}
      jsSrc="http://localhost:8383/main.js"
      stylesheetSrc="http://localhost:8383/styles.css"
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
          readOnly || !harAksjonspunkt,
          visFortsettknapp,
        )
      }
    />
  );
};
