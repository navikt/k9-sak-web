import { IndicatorWithOverlay, InstitutionIcon, RedCrossIconFilled } from '@navikt/k9-react-components';
import React from 'react';

const InnleggelsesperiodeIkonOverIkkeOppfylt = (): JSX.Element => (
    <IndicatorWithOverlay
        indicatorRenderer={() => <RedCrossIconFilled />}
        overlayRenderer={() => <InstitutionIcon />}
    />
);

export default InnleggelsesperiodeIkonOverIkkeOppfylt;
