import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  findAksjonspunkt,
  findEndpointsForMicrofrontend,
  httpErrorHandler as httpErrorHandlerFn,
} from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import React from 'react';

import { EtablertTilsyn } from '@k9-sak-web/fakta-etablert-tilsyn';

export default ({ aksjonspunkter, behandling, readOnly, submitCallback, saksbehandlere }) => {
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

  interface Endpoints {
    tilsyn: string;
    sykdom: string;
    sykdomInnleggelse: string;
  }

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
        saksbehandlere,
      }}
    />
  );
};
