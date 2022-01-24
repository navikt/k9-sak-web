import React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import MedisinskVilkarFaktaIndex from '@k9-sak-web/fakta-medisinsk-vilkar/src/MedisinskVilkarFaktaIndex';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import findAksjonspunkt from '../microfrontend/utils/findAksjonspunkt';
import httpErrorHandler from '../microfrontend/utils/httpErrorHandler';

export default ({ behandling: { links, uuid }, submitCallback, aksjonspunkter, readOnly, saksbehandlere }) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const medisinskVilkårAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.MEDISINSK_VILKAAR);
  const medisinskVilkårAksjonspunktkode = medisinskVilkårAksjonspunkt?.definisjon.kode;
  const medisinskVilkårAksjonspunktstatus = medisinskVilkårAksjonspunkt?.status.kode;
  const visFortsettknapp = medisinskVilkårAksjonspunktstatus === aksjonspunktStatus.OPPRETTET;

  const løsAksjonspunkt = aksjonspunktArgs =>
    submitCallback([
      { kode: medisinskVilkårAksjonspunktkode, begrunnelse: 'Sykdom er behandlet', ...aksjonspunktArgs },
    ]);

  const harAksjonspunkt = !!medisinskVilkårAksjonspunktkode;

  return (
    <MedisinskVilkarFaktaIndex
      behandlingUuid={uuid}
      endpoints={findEndpointsForMicrofrontend(links, [
        /*
         * TODO: har vi alle endepunkter vi trenger, er det endepunkter vi ikke trenger lenger?
         * Vi trenger egentlig ikke "findendpoints", da vi ikke er i en microfrontend lenger ...
         */
        { rel: 'sykdom-vurdering-oversikt-ktp', desiredName: 'vurderingsoversiktKontinuerligTilsynOgPleie' },
        { rel: 'sykdom-vurdering-oversikt-too', desiredName: 'vurderingsoversiktBehovForToOmsorgspersoner' },
        { rel: 'sykdom-vurdering-direkte', desiredName: 'hentVurdering' },
        { rel: 'sykdom-vurdering-opprettelse', desiredName: 'opprettVurdering' },
        { rel: 'sykdom-vurdering-endring', desiredName: 'endreVurdering' },
        { rel: 'sykdom-dokument-oversikt', desiredName: 'dokumentoversikt' },
        { rel: 'sykdom-innleggelse', desiredName: 'innleggelsesperioder' },
        { rel: 'sykdom-diagnosekoder', desiredName: 'diagnosekoder' },
        { rel: 'sykdom-dokument-liste', desiredName: 'dataTilVurdering' },
        { rel: 'sykdom-aksjonspunkt', desiredName: 'status' },
        { rel: 'sykdom-dokument-eksisterendevurderinger', desiredName: 'nyeDokumenter' },
      ])}
      readOnly={readOnly || !harAksjonspunkt}
      onFinished={løsAksjonspunkt}
      httpErrorHandler={httpErrorHandlerCaller}
      visFortsettknapp={visFortsettknapp}
      saksbehandlere={saksbehandlere || {}}
    />
  );
};
