import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { Alert, BodyShort, Box, VStack } from '@navikt/ds-react';
import { type JSX } from 'react';
import InnleggelsesperiodeVurdering from '../../../types/InnleggelsesperiodeVurdering';
import Vurderingstype from '../../../types/Vurderingstype';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

const hentVurderingstekst = (vurderingstype: Vurderingstype): string => {
  switch (vurderingstype) {
    case Vurderingstype.TO_OMSORGSPERSONER:
      return 'to omsorgspersoner';
    case Vurderingstype.LIVETS_SLUTTFASE:
      return 'livets sluttfase';
    default:
      return 'tilsyn og pleie';
  }
};

interface VurderingsoppsummeringForInnleggelsesperiodeProps {
  vurdering: InnleggelsesperiodeVurdering;
  vurderingstype: Vurderingstype;
}

const VurderingsoppsummeringForInnleggelsesperiode = ({
  vurdering,
  vurderingstype,
}: VurderingsoppsummeringForInnleggelsesperiodeProps): JSX.Element => {
  const erLivetsSluttfase = vurderingstype === Vurderingstype.LIVETS_SLUTTFASE;
  const vurderingstekst = hentVurderingstekst(vurderingstype);
  return (
    <DetailViewVurdering title={`Vurdering av ${vurderingstekst}`} perioder={[vurdering.periode]}>
      <Box marginBlock="space-24 space-0">
        <Alert size="small" variant={erLivetsSluttfase ? 'warning' : 'info'}>
          <VStack gap="space-8">
            <BodyShort size="small">
              {erLivetsSluttfase ? 'Avslått som følge av innleggelse' : 'Innvilget som følge av innleggelse'}
            </BodyShort>
            {vurdering.innleggelsesbegrunnelse && (
              <LabelledContent
                label="Begrunnelse for innleggelsesperioden"
                content={vurdering.innleggelsesbegrunnelse}
              />
            )}
          </VStack>
        </Alert>
      </Box>
    </DetailViewVurdering>
  );
};

export default VurderingsoppsummeringForInnleggelsesperiode;
