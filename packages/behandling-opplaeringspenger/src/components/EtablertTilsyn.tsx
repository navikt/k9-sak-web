import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  findAksjonspunkt,
  findEndpointsForMicrofrontend,
  httpErrorHandler as httpErrorHandlerFn,
} from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { EtablertTilsyn } from '@navikt/k9-fe-etablert-tilsyn';
import { EtablertTilsyn as LokalEtablertTilsyn } from '@k9-sak-web/fakta-etablert-tilsyn';
import React from 'react';

export default ({ aksjonspunkter, behandling, readOnly, submitCallback, saksbehandlere, featureToggles }) => {
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

  if (featureToggles?.LOKALE_PAKKER) {
    return (
      <LokalEtablertTilsyn
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
          saksbehandlere,
        }}
      />
    );
  }

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
        saksbehandlere,
      }}
    />
  );
};
