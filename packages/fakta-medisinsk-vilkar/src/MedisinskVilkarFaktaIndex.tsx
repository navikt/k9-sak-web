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
) => < RawIntlProvider value={intlConfig} >
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
    </RawIntlProvider >

export default MedisinskVilkarFaktaIndex;