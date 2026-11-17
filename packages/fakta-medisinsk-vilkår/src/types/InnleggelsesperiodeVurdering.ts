import { Period } from '@fpsak-frontend/utils';

interface InnleggelsesperiodeVurdering {
  id: string;
  periode: Period;
  erInnleggelsesperiode: true;
  innleggelsesbegrunnelse?: string;
  manglerLegeerklæring?: boolean;
}

export default InnleggelsesperiodeVurdering;
