import { IndicatorWithOverlay, InstitutionIcon, GreenCheckIconFilled } from '@navikt/k9-react-components';
import React from 'react';

const InnleggelsesperiodeIkonOverOppfylt = (): JSX.Element => (
    <IndicatorWithOverlay
        indicatorRenderer={() => <GreenCheckIconFilled />}
        overlayRenderer={() => <InstitutionIcon />}
    />
);

export default InnleggelsesperiodeIkonOverOppfylt;
