import React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingAppKontekst, Aksjonspunkt, SimpleEndpoints } from '@k9-sak-web/types';
import {
  MicroFrontend,
  httpErrorHandler,
  findEndpointsForMicrofrontend,
  findAksjonspunkt,
} from '@fpsak-frontend/utils';

const initializeOmBarnet = (
  elementId,
  httpErrorHandlerFn,
  endpoints: SimpleEndpoints,
  readOnly: boolean,
  løsAksjonspunkt: (data) => void,
) => {
  (window as any).renderOmBarnetApp(elementId, {
    httpErrorHandler: httpErrorHandlerFn,
    endpoints,
    readOnly,
    onFinished: løsAksjonspunkt,
  });
};

interface OmBarnetProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse }]: {
    kode: string;
    begrunnelse: string;
  }[]) => void;
}

const omBarnetAppID = 'omBarnet';
const OmBarnet = ({ behandling: { links }, readOnly, aksjonspunkter, submitCallback }: OmBarnetProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const omBarnetAksjonspunkt = findAksjonspunkt(
    aksjonspunkter,
    aksjonspunktCodes.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD,
  );
  const omBarnetAksjonspunktkode = omBarnetAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omBarnetAksjonspunktkode;

  const løsAksjonspunkt = data =>
    submitCallback([
      { kode: omBarnetAksjonspunktkode, begrunnelse: 'Rett etter pleietrengendes død er behandlet', ...data },
    ]);

  return (
    <MicroFrontend
      id={omBarnetAppID}
      jsSrc="/k9/microfrontend/psb-om-barnet/1/app.js"
      stylesheetSrc="/k9/microfrontend/psb-om-barnet/1/styles.css"
      noCache
      onReady={() =>
        initializeOmBarnet(
          omBarnetAppID,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(links, [
            {
              rel: 'rett-ved-dod',
              desiredName: 'rettVedDod',
            },
            { rel: 'om-pleietrengende', desiredName: 'omPleietrengende' },
          ]),
          readOnly || !harAksjonspunkt,
          løsAksjonspunkt,
        )
      }
    />
  );
};
export default OmBarnet;
