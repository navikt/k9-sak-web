import React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  MicroFrontend,
  httpErrorHandler,
  findEndpointsForMicrofrontend,
  findAksjonspunkt,
} from '@fpsak-frontend/utils';
import { SimpleEndpoints } from '@k9-sak-web/types';

const initializeMedisinskVilkår = (
  elementId,
  httpErrorHandlerFn,
  endpoints: SimpleEndpoints,
  behandlingUuid: string,
  løsAksjonspunkt,
  readOnly,
  visFortsettknapp,
  saksbehandlere,
  fagsakYtelseType,
  behandlingType,
) => {
  (window as any).renderMedisinskVilkarApp(elementId, {
    httpErrorHandler: httpErrorHandlerFn,
    endpoints,
    behandlingUuid,
    onFinished: løsAksjonspunkt,
    readOnly,
    visFortsettknapp,
    saksbehandlere,
    fagsakYtelseType,
    behandlingType,
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default ({
  behandling: { links, uuid },
  submitCallback,
  aksjonspunkter,
  readOnly,
  saksbehandlere,
  fagsakYtelseType,
  behandlingType,
}) => {
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
    <MicroFrontend
      id={medisinskVilkårAppID}
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1/app.js"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1/styles.css"
      noCache
      onReady={() =>
        initializeMedisinskVilkår(
          medisinskVilkårAppID,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(links, [
            { rel: 'sykdom-vurdering-oversikt-ktp', desiredName: 'vurderingsoversiktKontinuerligTilsynOgPleie' },
            { rel: 'sykdom-vurdering-oversikt-too', desiredName: 'vurderingsoversiktBehovForToOmsorgspersoner' },
            { rel: 'sykdom-vurdering-oversikt-slu', desiredName: 'vurderingsoversiktLivetsSluttfase' },
            { rel: 'sykdom-vurdering-direkte', desiredName: 'hentVurdering' },
            { rel: 'sykdom-vurdering-opprettelse', desiredName: 'opprettVurdering' },
            { rel: 'sykdom-vurdering-endring', desiredName: 'endreVurdering' },
            { rel: 'sykdom-dokument-oversikt', desiredName: 'dokumentoversikt' },
            { rel: 'sykdom-innleggelse', desiredName: 'innleggelsesperioder' },
            { rel: 'sykdom-diagnosekoder', desiredName: 'diagnosekoder' },
            { rel: 'sykdom-dokument-liste', desiredName: 'dataTilVurdering' },
            { rel: 'sykdom-aksjonspunkt', desiredName: 'status' },
            { rel: 'sykdom-dokument-eksisterendevurderinger', desiredName: 'nyeDokumenter' },
          ]),
          uuid,
          løsAksjonspunkt,
          readOnly || !harAksjonspunkt,
          visFortsettknapp,
          saksbehandlere || {},
          fagsakYtelseType,
          behandlingType,
        )
      }
    />
  );
};
