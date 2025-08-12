import type {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidVurderingDto as ReisetidVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { Period } from '@navikt/ft-utils';
import { useContext, useState } from 'react';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { CenteredLoader } from '../CenteredLoader';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { useVurdertReisetid } from '../SykdomOgOpplæringQueries';
import ReisetidContainer from './ReisetidContainer';

interface ReisetidVurderingselement extends Omit<Vurderingselement, 'resultat'>, ReisetidVurderingDto {
  perioder: Period[];
  resultat: ReisetidResultat;
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
              nyesteFørst={false}
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
