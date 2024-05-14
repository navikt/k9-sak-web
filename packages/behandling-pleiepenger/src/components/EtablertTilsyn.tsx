import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  findAksjonspunkt,
  findEndpointsForMicrofrontend,
  httpErrorHandler as httpErrorHandlerFn,
} from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import { EtablertTilsyn } from '@k9-sak-web/fakta-etablert-tilsyn';
import { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';

export default ({
  aksjonspunkter,
  behandling,
  readOnly,
  submitCallback,
}: {
  aksjonspunkter: Aksjonspunkt[];
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  submitCallback: (params: any) => void;
}) => {
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
    <EtablertTilsyn
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        readOnly: readOnly || !harAksjonspunkt,
        endpoints: findEndpointsForMicrofrontend(behandling.links, [
          { rel: 'pleiepenger-sykt-barn-tilsyn', desiredName: 'tilsyn' },
          { rel: 'sykdom-vurdering-oversikt-ktp', desiredName: 'sykdom' },
          { rel: 'sykdom-innleggelse', desiredName: 'sykdomInnleggelse' },
        ]),
        lagreBeredskapvurdering: løsBeredskapAksjonspunkt,
        lagreNattevåkvurdering: løsNattevåkAksjonspunkt,
        harAksjonspunktForBeredskap: harUløstAksjonspunktForBeredskap,
        harAksjonspunktForNattevåk: harUløstAksjonspunktForNattevåk,
      }}
    />
  );
};
