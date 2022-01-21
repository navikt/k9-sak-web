import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';
import { Box, Margin } from '@navikt/k9-react-components';
import InnleggelsesperiodeVurdering from '../../../types/InnleggelsesperiodeVurdering';
import Vurderingstype from '../../../types/Vurderingstype';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

interface VurderingsoppsummeringForInnleggelsesperiodeProps {
    vurdering: InnleggelsesperiodeVurdering;
    vurderingstype: Vurderingstype;
}

const VurderingsoppsummeringForInnleggelsesperiode = ({
    vurdering,
    vurderingstype,
}: VurderingsoppsummeringForInnleggelsesperiodeProps): JSX.Element => {
    const vurderingstekst =
        vurderingstype === Vurderingstype.TO_OMSORGSPERSONER ? 'to omsorgspersoner' : 'tilsyn og pleie';
    return (
        <DetailViewVurdering title={`Vurdering av ${vurderingstekst}`} perioder={[vurdering.periode]}>
            <Box marginTop={Margin.large}>
                <Alertstripe type="info">Innvilget som følge av innleggelse</Alertstripe>
            </Box>
        </DetailViewVurdering>
    );
};

export default VurderingsoppsummeringForInnleggelsesperiode;
