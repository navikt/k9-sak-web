import * as React from 'react';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { MicroFrontend } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import findEndpointsForMicrofrontend from '../microfrontend/utils/findEndpointsForMicrofrontend';
import SimpleEndpoints from '../microfrontend/types/SimpleEndpoints';
import findAksjonspunkt from '../microfrontend/utils/findAksjonspunkt';
import httpErrorHandler from '../microfrontend/utils/httpErrorHandler';

const initializeMedisinskVilkår = (
  elementId,
  httpErrorHandlerFn,
  endpoints: SimpleEndpoints,
  behandlingUuid: string,
  løsAksjonspunkt,
  readOnly,
  visFortsettknapp,
) => {
  (window as any).renderMedisinskVilkarApp(elementId, {
    httpErrorHandler: httpErrorHandlerFn,
    endpoints,
    behandlingUuid,
    onFinished: løsAksjonspunkt,
    readOnly,
    visFortsettknapp,
  });
};

const medisinskVilkårAppID = 'medisinskVilkårApp';
export default ({ behandling: { links, uuid }, submitCallback, aksjonspunkter, readOnly }) => {
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
      jsSrc="/k9/microfrontend/medisinsk-vilkar/1.9.1/app.js"
      jsIntegrity="sha384-73hhEQUrzpFhPSiRyabNtJ8TJK5BL0Pfp/Z1TUMrV4MXjRr9QQS7EA44iL5mynZd"
      stylesheetSrc="/k9/microfrontend/medisinsk-vilkar/1.9.1/styles.css"
      stylesheetIntegrity="sha384-VNQ5YXmA3agdm788W50H5p8VEACE0q2DoiyWIa3tBrh/JKB65iWSi0SRQLoJHlyk"
      onReady={() =>
        initializeMedisinskVilkår(
          medisinskVilkårAppID,
          httpErrorHandlerCaller,
          findEndpointsForMicrofrontend(links, [
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
          ]),
          uuid,
          løsAksjonspunkt,
          readOnly || !harAksjonspunkt,
          visFortsettknapp,
        )
      }
    />
  );
};
