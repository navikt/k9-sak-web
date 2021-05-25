import { MicroFrontend } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import * as React from 'react';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import httpErrorHandlerFn from '../microfrontend/utils/httpErrorHandler';
import findAksjonspunkt from '../microfrontend/utils/findAksjonspunkt';

const initializeEtablertTilsynApp = (
  elementId,
  httpErrorHandler,
  endpoints: SimpleEndpoints,
  readOnly,
  lagreBeredskapvurdering,
  lagreNattevåkvurdering,
  harAksjonspunktForBeredskap,
  harAksjonspunktForNattevåk,
) => {
  (window as any).renderTilsynApp(elementId, {
    httpErrorHandler,
    readOnly,
    endpoints,
    lagreBeredskapvurdering,
    lagreNattevåkvurdering,
    harAksjonspunktForBeredskap,
    harAksjonspunktForNattevåk,
  });
};

const etablertTilsynAppId = 'etablertTilsynApp';
export default ({ aksjonspunkter, behandling, readOnly, submitCallback }) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandlerFn(status, addErrorMessage, locationHeader);

  const beredskapAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.BEREDSKAP);
  const beredskapAksjonspunktkode = beredskapAksjonspunkt?.definisjon.kode;
  const løsBeredskapAksjonspunkt = beredskapsperioder =>
    submitCallback([{ kode: beredskapAksjonspunktkode, begrunnelse: 'Beredskap er behandlet', ...beredskapsperioder }]);

  const nattevåkAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.NATTEVÅK);
  const nattevåkAksjonspunktkode = nattevåkAksjonspunkt?.definisjon.kode;
  const løsNattevåkAksjonspunkt = nattevåkperioder =>
    submitCallback([{ kode: nattevåkAksjonspunktkode, begrunnelse: 'Nattevåk er behandlet', ...nattevåkperioder }]);

  const harUløstAksjonspunktForBeredskap = beredskapAksjonspunkt?.status.kode === aksjonspunktStatus.OPPRETTET;
  const harUløstAksjonspunktForNattevåk = nattevåkAksjonspunkt?.status.kode === aksjonspunktStatus.OPPRETTET;
  const harAksjonspunkt = !!beredskapAksjonspunktkode || !!nattevåkAksjonspunktkode;

  return (
    <MicroFrontend
      id={etablertTilsynAppId}
      jsSrc="/k9/microfrontend/psb-etablert-tilsyn-frontend/0.0.1/app.js"
      jsIntegrity="sha384-s9dLshuXEIGIQ0Hz++UtuqFv2N871nMTCdugHzBj4JVehpSdmhxoqikvMeb7NEka"
      stylesheetSrc="/k9/microfrontend/psb-etablert-tilsyn-frontend/0.0.1/styles.css"
      stylesheetIntegrity="sha384-eVELKPD3SjXCXS1i5+MBsUc4eIk0BFYyRFyYQZ7Q4GZ+nC2AGEgwxAKtzTZX4DwQ"
      onReady={() =>
        initializeEtablertTilsynApp(
          etablertTilsynAppId,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(behandling.links, [
            { rel: 'pleiepenger-sykt-barn-tilsyn', desiredName: 'tilsyn' },
          ]),
          readOnly || !harAksjonspunkt,
          løsBeredskapAksjonspunkt,
          løsNattevåkAksjonspunkt,
          harUløstAksjonspunktForBeredskap,
          harUløstAksjonspunktForNattevåk,
        )
      }
    />
  );
};
