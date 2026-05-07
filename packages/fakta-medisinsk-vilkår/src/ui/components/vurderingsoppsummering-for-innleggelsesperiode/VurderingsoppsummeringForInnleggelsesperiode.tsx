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
  const erLivetsSluttfase = vurderingstype === Vurderingstype.LIVETS_SLUTTFASE;
  const vurderingstekst =
    vurderingstype === Vurderingstype.TO_OMSORGSPERSONER
      ? 'to omsorgspersoner'
      : vurderingstype === Vurderingstype.LIVETS_SLUTTFASE
        ? 'livets sluttfase'
        : 'tilsyn og pleie';
  return (
    <DetailViewVurdering title={`Vurdering av ${vurderingstekst}`} perioder={[vurdering.periode]}>
      <Box marginBlock="space-24 space-0">
        <Alert size="small" variant={erLivetsSluttfase ? 'warning' : 'info'}>
          {erLivetsSluttfase ? 'Avslått som følge av innleggelse' : 'Innvilget som følge av innleggelse'}
        </Alert>
      </Box>
    </DetailViewVurdering>
  );
};

export default VurderingsoppsummeringForInnleggelsesperiode;
