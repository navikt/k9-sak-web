import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '@fpsak-frontend/fakta-overstyr-beregning/i18n'
import OverstyrBeregningFaktaIndex from '@fpsak-frontend/fakta-overstyr-beregning';

const intl = createIntl(
    {
        locale: 'nb-NO',
        messages: { ...messages },
    },
    createIntlCache(),
);

export default {
    title: 'fakta/overstyr-beregning-input',
    component: OverstyrBeregningFaktaIndex,
};

export const visOverstyrBeregningIndex = () => (
    <RawIntlProvider value={intl}>
        <OverstyrBeregningFaktaIndex
            behandlingId={123}
        />
    </RawIntlProvider>
);
