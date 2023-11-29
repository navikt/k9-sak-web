import React from 'react';
import { Alert } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
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
        <Alert size="small" variant="info">
          Innvilget som følge av innleggelse
        </Alert>
      </Box>
    </DetailViewVurdering>
  );
};

export default VurderingsoppsummeringForInnleggelsesperiode;
