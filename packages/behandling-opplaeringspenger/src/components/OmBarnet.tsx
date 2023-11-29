import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsForMicrofrontend, httpErrorHandler } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';
import { OmBarnet } from '@navikt/k9-fe-om-barnet';
import React from 'react';

interface OmBarnetProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse }]: {
    kode: string;
    begrunnelse: string;
  }[]) => void;
}

export default ({ behandling: { links }, readOnly, aksjonspunkter, submitCallback }: OmBarnetProps) => {
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
    <OmBarnet
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        endpoints: findEndpointsForMicrofrontend(links, [
          {
            rel: 'rett-ved-dod',
            desiredName: 'rettVedDod',
          },
          { rel: 'om-pleietrengende', desiredName: 'omPleietrengende' },
        ]),
        readOnly: readOnly || !harAksjonspunkt,
        onFinished: løsAksjonspunkt,
      }}
    />
  );
};
