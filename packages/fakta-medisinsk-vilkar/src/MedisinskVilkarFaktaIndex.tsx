import React from "react";
import { createIntl, createIntlCache } from "react-intl";
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intlConfig = createIntl(
    {
        locale: 'nb-NO',
        messages,
    },
    cache,
);

const MedisinskVilkarFaktaIndex = () => <>
    <p>Dokumenter til behandling</p>
    <p>Innleggeslsesperioder</p></>

export default MedisinskVilkarFaktaIndex;