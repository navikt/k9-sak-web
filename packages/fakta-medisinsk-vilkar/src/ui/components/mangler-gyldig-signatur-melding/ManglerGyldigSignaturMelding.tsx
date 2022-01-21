import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';

interface ManglerGyldigSignaturMeldingProps {
    children: React.ReactNode;
}

const ManglerGyldigSignaturMelding = ({ children }: ManglerGyldigSignaturMeldingProps): JSX.Element => (
    <Alertstripe type="info">{children}</Alertstripe>
);

export default ManglerGyldigSignaturMelding;
