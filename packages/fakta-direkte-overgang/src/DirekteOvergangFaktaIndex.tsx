import React from "react";
import { Aksjonspunkt } from '@k9-sak-web/types';

import ManglerSøknadForm from "./components/ManglerSøknadForm";
import messages from '../i18n/nb_NO.json';

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
        />)

export default DirekteOvergangFaktaIndex;
