import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsForMicrofrontend, httpErrorHandler } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';
import { OmsorgenFor } from '@k9-sak-web/fakta-omsorgen-for';

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

export default ({ behandling: { links }, readOnly, aksjonspunkter, submitCallback }: OmsorgenForProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([{ kode: omsorgenForAksjonspunktkode, begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder }]);

  return (
    <OmsorgenFor
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        endpoints: findEndpointsForMicrofrontend(links, [
          {
            rel: 'omsorgen-for',
            desiredName: 'omsorgsperioder',
          },
        ]),
        readOnly: readOnly || !harAksjonspunkt,
        onFinished: løsAksjonspunkt,
      }}
    />
  );
};
