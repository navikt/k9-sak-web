import { MicroFrontend } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingAppKontekst, Aksjonspunkt } from '@k9-sak-web/types';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import httpErrorHandler from '../microfrontend/utils/httpErrorHandler';
import findAksjonspunkt from '../microfrontend/utils/findAksjonspunkt';

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

  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.OMSORGEN_FOR_PLEIEPENGER);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const readOnlyArgument = omsorgenForAksjonspunktkode === undefined ? true : readOnly;

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([{ kode: omsorgenForAksjonspunktkode, begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder }]);

  return (
    <MicroFrontend
      id={omsorgenForAppID}
      jsSrc="/k9/microfrontend/omsorgen-for/0.0.7/app.js"
      jsIntegrity="sha384-Psp28Yo1Kz8fJ47S6Dw9RH/ko3/WKbTf7fa6uCHf5EpaxLCMTBUYC6a5P0OF3pQM"
      stylesheetSrc="/k9/microfrontend/omsorgen-for/0.0.7/styles.css"
      stylesheetIntegrity="sha384-3uSZs3lCTYJO4mzRqb+62oyYClv1uSgafnlpblN71dyphBr0Xl2Af57JuZlb2ocj"
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
