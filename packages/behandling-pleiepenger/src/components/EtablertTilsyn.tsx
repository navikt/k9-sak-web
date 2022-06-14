import { MicroFrontend } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import React from 'react';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import httpErrorHandlerFn from '../microfrontend/utils/httpErrorHandler';
import findAksjonspunkt from '../microfrontend/utils/findAksjonspunkt';

const etablertTilsynAppId = 'etablertTilsynApp';
const initializeEtablertTilsynApp = (
  httpErrorHandler,
  endpoints: SimpleEndpoints,
  readOnly,
  lagreBeredskapvurdering,
  lagreNattevåkvurdering,
  harAksjonspunktForBeredskap,
  harAksjonspunktForNattevåk,
  saksbehandlere,
) => {
  (window as any).renderTilsynApp(etablertTilsynAppId, {
    httpErrorHandler,
    readOnly,
    endpoints,
    lagreBeredskapvurdering,
    lagreNattevåkvurdering,
    harAksjonspunktForBeredskap,
    harAksjonspunktForNattevåk,
    saksbehandlere,
  });
};

export default ({ aksjonspunkter, behandling, readOnly, submitCallback, saksbehandlere }) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandlerFn(status, addErrorMessage, locationHeader);

  const beredskapAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.BEREDSKAP);
  const beredskapAksjonspunktkode = beredskapAksjonspunkt?.definisjon;
  const løsBeredskapAksjonspunkt = beredskapsperioder =>
    submitCallback([{ kode: beredskapAksjonspunktkode, begrunnelse: 'Beredskap er behandlet', ...beredskapsperioder }]);

  const nattevåkAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.NATTEVÅK);
  const nattevåkAksjonspunktkode = nattevåkAksjonspunkt?.definisjon;
  const løsNattevåkAksjonspunkt = nattevåkperioder =>
    submitCallback([{ kode: nattevåkAksjonspunktkode, begrunnelse: 'Nattevåk er behandlet', ...nattevåkperioder }]);

  const harUløstAksjonspunktForBeredskap = beredskapAksjonspunkt?.status === aksjonspunktStatus.OPPRETTET;
  const harUløstAksjonspunktForNattevåk = nattevåkAksjonspunkt?.status === aksjonspunktStatus.OPPRETTET;
  const harAksjonspunkt = !!beredskapAksjonspunktkode || !!nattevåkAksjonspunktkode;

  return (
    <MicroFrontend
      id={etablertTilsynAppId}
      jsSrc="/k9/microfrontend/psb-etablert-tilsyn/1/app.js"
      stylesheetSrc="/k9/microfrontend/psb-etablert-tilsyn/1/styles.css"
      noCache
      onReady={() =>
        initializeEtablertTilsynApp(
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(behandling.links, [
            { rel: 'pleiepenger-sykt-barn-tilsyn', desiredName: 'tilsyn' },
          ]),
          readOnly || !harAksjonspunkt,
          løsBeredskapAksjonspunkt,
          løsNattevåkAksjonspunkt,
          harUløstAksjonspunktForBeredskap,
          harUløstAksjonspunktForNattevåk,
          saksbehandlere,
        )
      }
    />
  );
};
