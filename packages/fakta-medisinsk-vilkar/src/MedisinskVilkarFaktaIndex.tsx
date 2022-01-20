import React from "react";
import { createIntl, createIntlCache, RawIntlProvider } from "react-intl";
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intlConfig = createIntl(
    {
        locale: 'nb-NO',
        messages,
    },
    cache,
);

const MedisinskVilkarFaktaIndex = () =>
    <RawIntlProvider value={intlConfig}>

        <p>Dokumenter til behandling</p>
        <p>Innleggeslsesperioder</p>

    </RawIntlProvider>

export default MedisinskVilkarFaktaIndex;