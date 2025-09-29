import { Alert, Box } from '@navikt/ds-react';
import { type JSX } from 'react';
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
      <Box.New marginBlock="6 0">
        <Alert size="small" variant="info">
          Innvilget som følge av innleggelse
        </Alert>
      </Box.New>
    </DetailViewVurdering>
  );
};

export default VurderingsoppsummeringForInnleggelsesperiode;
