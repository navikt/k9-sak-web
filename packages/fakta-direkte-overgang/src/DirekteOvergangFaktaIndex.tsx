import React from "react";
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { Aksjonspunkt } from '@k9-sak-web/types';

import ManglerSøknadForm from "./components/ManglerSøknadForm";
import messages from '../i18n/nb_NO.json';

// Kompileringsfeil her betyr at BRUK_V2_DIREKTE_OVERGANG er fjernet fra FeatureToggles.
// Slett hele packages/fakta-direkte-overgang og fjern v1-grenen i FaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting = import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DIREKTE_OVERGANG'];

const intlCache = createIntlCache();
const intl = createIntl({ locale: 'nb-NO', messages }, intlCache);

interface Props {
    submitCallback: () => void,
    readOnly: boolean,
    submittable: boolean,
    aksjonspunkter: Aksjonspunkt[],
}

/**
 * DirekteOvergangFaktaIndex
 */
const DirekteOvergangFaktaIndex = ({
    submitCallback,
    readOnly,
    submittable,
    aksjonspunkter,
}: Props) => (
    <RawIntlProvider value={intl} >
        <ManglerSøknadForm
            submitCallback={submitCallback}
            readOnly={readOnly}
            submittable={submittable}
            aksjonspunkter={aksjonspunkter}
        />
    </RawIntlProvider>
)

export default DirekteOvergangFaktaIndex;
