import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { useVurdertReisetid } from '../SykdomOgOpplæringQueries';
import { useContext, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Period } from '@navikt/ft-utils';
import type { ReisetidPeriodeVurderingDtoResultat, ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import ReisetidContainer from './ReisetidContainer';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import { CenteredLoader } from '../CenteredLoader';

interface ReisetidVurderingselement extends Omit<Vurderingselement, 'resultat'>, ReisetidVurderingDto {
  perioder: Period[];
  resultat: ReisetidPeriodeVurderingDtoResultat;
}

const ReisetidIndex = () => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: vurdertReisetid, isLoading: isLoadingVurdertReisetid } = useVurdertReisetid(behandlingUuid);
  const [valgtVurdering, setValgtVurdering] = useState<ReisetidVurderingselement | null>(null);

  const vurderingsliste = vurdertReisetid?.vurderinger.map(vurdering => ({
    ...vurdering,
    resultat: vurdering.reisetid.resultat,
    perioder: [new Period(vurdering.reisetid.periode.fom, vurdering.reisetid.periode.tom)],
  }));

  if (isLoadingVurdertReisetid) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <NavigationWithDetailView
        navigationSection={() => (
          <>
            <Vurderingsnavigasjon<ReisetidVurderingselement>
              valgtPeriode={valgtVurdering}
              perioder={vurderingsliste || []}
              onPeriodeClick={setValgtVurdering}
            />
          </>
        )}
        showDetailSection
        detailSection={() => (valgtVurdering ? <ReisetidContainer vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default ReisetidIndex;
