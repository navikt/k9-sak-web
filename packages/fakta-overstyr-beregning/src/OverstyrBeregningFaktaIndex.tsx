import React from "react";
import { injectIntl, WrappedComponentProps, createIntlCache, createIntl, RawIntlProvider } from 'react-intl';

import OverstyrBeregningFaktaForm from "./components/OverstyrBeregningFaktaForm";
import messages from '../i18n/nb_NO.json';

const intlCache = createIntlCache();
const intl = createIntl({ locale: 'nb-NO', messages }, intlCache);

interface Props {
    behandlingId?: number;
};

/**
 * OverstyrBeregningFaktaIndex
 */
const OverstyrBeregningFaktaIndex = ({ behandlingId }: Props & WrappedComponentProps) => (
    <RawIntlProvider value={intl} >
        <OverstyrBeregningFaktaForm behandlingId={123} />
    </RawIntlProvider>
)

export default OverstyrBeregningFaktaIndex;