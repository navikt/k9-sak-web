import React from "react";
import { createIntl, createIntlCache, RawIntlProvider } from "react-intl";
import messages from '../i18n/nb_NO.json';
import ContainerContract from "./types/ContainerContract";
import MainComponent from "./ui/MainComponent";

const cache = createIntlCache();

const intlConfig = createIntl(
    {
        locale: 'nb-NO',
        messages,
    },
    cache,
);

/*
data til medisinsk vilkar:
endepunkter:
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

    elementId,
    httpErrorHandlerFn,
    endpoints: SimpleEndpoints,
    behandlingUuid: string,
    løsAksjonspunkt,
    readOnly,
    visFortsettknapp,
    saksbehandlere,
*/

const MedisinskVilkarFaktaIndex = (
    {
        behandlingUuid,
        endpoints,
        readOnly,
        onFinished,
        httpErrorHandler,
        visFortsettknapp,
        saksbehandlere,
    }: ContainerContract
) =>

    // const data: ContainerContract = {
    //     endpoints: findEndpointsForMicrofrontend(links, [
    //         { rel: 'sykdom-vurdering-oversikt-ktp', desiredName: 'vurderingsoversiktKontinuerligTilsynOgPleie' },
    //         { rel: 'sykdom-vurdering-oversikt-too', desiredName: 'vurderingsoversiktBehovForToOmsorgspersoner' },
    //         { rel: 'sykdom-vurdering-direkte', desiredName: 'hentVurdering' },
    //         { rel: 'sykdom-vurdering-opprettelse', desiredName: 'opprettVurdering' },
    //         { rel: 'sykdom-vurdering-endring', desiredName: 'endreVurdering' },
    //         { rel: 'sykdom-dokument-oversikt', desiredName: 'dokumentoversikt' },
    //         { rel: 'sykdom-innleggelse', desiredName: 'innleggelsesperioder' },
    //         { rel: 'sykdom-diagnosekoder', desiredName: 'diagnosekoder' },
    //         { rel: 'sykdom-dokument-liste', desiredName: 'dataTilVurdering' },
    //         { rel: 'sykdom-aksjonspunkt', desiredName: 'status' },
    //         { rel: 'sykdom-dokument-eksisterendevurderinger', desiredName: 'nyeDokumenter' },
    //       ]),
    //     behandlingUuid: ;
    //     readOnly: ;
    //     onFinished: (...args: unknown[]) => void;
    //     httpErrorHandler: ;
    //     visFortsettknapp: ;
    //     saksbehandlere: ;
    // };

    // console.log("behandling", behandling);
    <RawIntlProvider value={intlConfig}>
        <MainComponent containerData={{
            endpoints,
            behandlingUuid,
            readOnly,
            onFinished,
            httpErrorHandler,
            visFortsettknapp,
            saksbehandlere,
        }
        } />
    </RawIntlProvider>



export default MedisinskVilkarFaktaIndex;