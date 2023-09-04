import React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingAppKontekst, Aksjonspunkt, SimpleEndpoints, Fagsak } from '@k9-sak-web/types';
import {
  MicroFrontend,
  httpErrorHandler,
  findEndpointsForMicrofrontend,
  findAksjonspunkt,
} from '@fpsak-frontend/utils';

const initializeOmsorgenFor = (
  elementId,
  httpErrorHandlerFn,
  endpoints: SimpleEndpoints,
  readOnly: boolean,
  løsAksjonspunkt: (omsorgsperioder, fosterbarnForOmsorgspenger) => void,
  sakstype: string,
  saksbehandlere: { [key: string]: string },
) => {
  (window as any).renderOmsorgenForApp(elementId, {
    httpErrorHandler: httpErrorHandlerFn,
    endpoints,
    readOnly,
    onFinished: løsAksjonspunkt,
    sakstype,
    saksbehandlere,
  });
};

interface OmsorgenForProps {
  behandling: BehandlingAppKontekst;
  fagsak: Fagsak;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse, omsorgsperioder }]: {
    kode: string;
    begrunnelse: string;
    omsorgsperioder: any;
    fosterbarnForOmsorgspenger: any;
  }[]) => void;
  saksbehandlere: { [key: string]: string };
}

const omsorgenForAppID = 'omsorgenForApp';
const OmsorgenFor = ({
  behandling,
  fagsak,
  readOnly,
  aksjonspunkter,
  submitCallback,
  saksbehandlere,
}: OmsorgenForProps) => {
  const { links } = behandling;
  const sakstype = fagsak.sakstype.kode;

  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = (omsorgsperioder, fosterbarnForOmsorgspenger) =>
    submitCallback([
      {
        kode: omsorgenForAksjonspunktkode,
        begrunnelse: 'Omsorgen for er behandlet',
        omsorgsperioder,
        fosterbarnForOmsorgspenger,
      },
    ]);

  return (
    <MicroFrontend
      id={omsorgenForAppID}
      jsSrc="/k9/microfrontend/omsorgen-for/1/app.js"
      stylesheetSrc="/k9/microfrontend/omsorgen-for/1/styles.css"
      noCache
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
          readOnly || !harAksjonspunkt,
          løsAksjonspunkt,
          sakstype,
          saksbehandlere || {},
        )
      }
    />
  );
};
export default OmsorgenFor;
