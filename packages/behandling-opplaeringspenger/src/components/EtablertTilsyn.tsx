import { EtablertTilsyn } from '@k9-sak-web/fakta-etablert-tilsyn';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import {
  findAksjonspunkt,
  findEndpointsForMicrofrontend,
  httpErrorHandler as httpErrorHandlerFn,
} from '@k9-sak-web/utils';
import React from 'react';

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
    <EtablertTilsyn
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        readOnly: readOnly || !harAksjonspunkt,
        endpoints: findEndpointsForMicrofrontend(behandling.links, [
          { rel: 'opplaeringspenger-sykt-barn-tilsyn', desiredName: 'tilsyn' },
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
