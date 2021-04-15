import { MicroFrontend } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingAppKontekst, Aksjonspunkt } from '@k9-sak-web/types';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import httpErrorHandler from '../microfrontend/utils/httpErrorHandler';
import findAksjonspunktkode from '../microfrontend/utils/findAksjonspunktkode';

const initializeOmsorgenFor = (
  elementId,
  httpErrorHandlerFn,
  endpoints: SimpleEndpoints,
  readOnly: boolean,
  løsAksjonspunkt: (omsorgsperioder) => void,
) => {
  (window as any).renderOmsorgenForApp(elementId, {
    httpErrorHandler: httpErrorHandlerFn,
    endpoints,
    readOnly,
    onFinished: løsAksjonspunkt,
  });
};

interface OmsorgenForProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse, omsorgsperioder }]: {
    kode: string;
    begrunnelse: string;
    omsorgsperioder: any;
  }[]) => void;
}

const omsorgenForAppID = 'omsorgenForApp';
const OmsorgenFor = ({ behandling: { links }, readOnly, aksjonspunkter, submitCallback }: OmsorgenForProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const omsorgenForAksjonspunktkode = findAksjonspunktkode(aksjonspunkter, aksjonspunktCodes.OMSORGEN_FOR_PLEIEPENGER);

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([{ kode: omsorgenForAksjonspunktkode, begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder }]);

  return (
    <MicroFrontend
      id={omsorgenForAppID}
      jsSrc="http://localhost:8081/main.js"
      // jsIntegrity="sha384-iNIBcJsYevOG/6mMde96Zy76+n0IarHJehHRWuBmVxn6fGK5sHlm4fRVIeLyXp3S"
      stylesheetSrc="http://localhost:8081/styles.css"
      // stylesheetIntegrity="sha384-Ns3um5ypN0Dx4jWK7OT/rD9piP7up1qj4/bP3AYwhQtLHhc2SOMBTStumAyR0IXu"
      onReady={() =>
        initializeOmsorgenFor(
          omsorgenForAppID,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(links, [
            {
              rel: 'omsorgen-for',
              desiredName: 'omsorgsperioder',
            },
          ]),
          readOnly,
          løsAksjonspunkt,
        )
      }
    />
  );
};
export default OmsorgenFor;
