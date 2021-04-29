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
      jsSrc="/k9/microfrontend/omsorgen-for/0.0.5/app.js"
      jsIntegrity="sha384-eR4FATfb+Xk57LyVogPfUIRrYJ4vpYiZb9FxPdo4FVT0eHNKkE32zLrIRZY9GZgT"
      stylesheetSrc="/k9/microfrontend/omsorgen-for/0.0.5/styles.css"
      stylesheetIntegrity="sha384-mrmomnx+L8nv4g7P+hsbpbXQNOmlMyx33DdRzd9JvB2GBKsBaE0wRbgTSWDM5VA4"
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
