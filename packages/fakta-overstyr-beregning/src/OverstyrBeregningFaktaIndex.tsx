import React from "react";
import { WrappedComponentProps, createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
    
import OverstyrBeregningFaktaForm from "./components/OverstyrBeregningFaktaForm";
import messages from '../i18n/nb_NO.json';

const intlCache = createIntlCache();
const intl = createIntl({ locale: 'nb-NO', messages }, intlCache);

interface Props {
    behandlingId?: number;
    arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
};

/**
 * OverstyrBeregningFaktaIndex
 */
const OverstyrBeregningFaktaIndex = (props: Props & WrappedComponentProps) => {
    // eslint-disable-next-line no-console
    console.log(props)
    return (
    <RawIntlProvider value={intl} >
        <OverstyrBeregningFaktaForm 
            behandlingId={props.behandlingId} 
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId} 
        />
    </RawIntlProvider>
);
    }

export default OverstyrBeregningFaktaIndex;