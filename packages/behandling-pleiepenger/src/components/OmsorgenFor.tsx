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
  const readOnlyArgument = omsorgenForAksjonspunktkode === undefined ? readOnly : false;

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([{ kode: omsorgenForAksjonspunktkode, begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder }]);

  return (
    <MicroFrontend
      id={omsorgenForAppID}
      jsSrc="/k9/microfrontend/omsorgen-for/0.0.2/app.js"
      jsIntegrity="sha384-YrL5bkoHXKVVAKDGiBqEX0GEKcqCv7EOvBNLF1vBGduhhBm+OejJGKgWTQ+H9Gus"
      stylesheetSrc="/k9/microfrontend/omsorgen-for/0.0.2/styles.css"
      stylesheetIntegrity="sha384-w2PdtoY2cCaSVMgsK7t8r3RN85aXP4wrE9hywMsNXNFelhn2X9H7qTqYF1Q3uNWU"
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
          readOnlyArgument,
          løsAksjonspunkt,
        )
      }
    />
  );
};
export default OmsorgenFor;
