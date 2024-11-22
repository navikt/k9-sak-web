import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { findAksjonspunkt, findEndpointsFromRels, httpErrorHandler as httpErrorHandlerFn } from '@fpsak-frontend/utils';
import { EtablertTilsynContainer } from '@k9-sak-web/fakta-etablert-tilsyn';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

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
    <EtablertTilsynContainer
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        readOnly: readOnly || !harAksjonspunkt,
        endpoints: findEndpointsFromRels(behandling.links, [
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
