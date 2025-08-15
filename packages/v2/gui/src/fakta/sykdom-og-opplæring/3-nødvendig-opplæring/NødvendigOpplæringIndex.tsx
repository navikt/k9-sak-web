import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { useVurdertOpplæring } from '../SykdomOgOpplæringQueries';
import { useContext, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Period } from '@navikt/ft-utils';
import { type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import NødvendigOpplæringContainer from './NødvendigOpplæringContainer';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import { CenteredLoader } from '../CenteredLoader';
import NødvendigOpplæringAlert from './NødvendigOpplæringAlerts';

interface OpplæringVurderingselement extends Omit<Vurderingselement, 'resultat'>, OpplæringVurderingDto {
  perioder: Period[];
}

const NødvendigOpplæring = () => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: vurdertOpplæring, isLoading: isLoadingVurdertOpplæring } = useVurdertOpplæring(behandlingUuid);
  const [valgtVurdering, setValgtVurdering] = useState<OpplæringVurderingselement | null>(null);
  const vurderingsliste = vurdertOpplæring?.vurderinger.map(vurdering => ({
    ...vurdering,
    perioder: [new Period(vurdering.opplæring.fom, vurdering.opplæring.tom)],
  }));

  if (isLoadingVurdertOpplæring) {
    return <CenteredLoader />;
  }
  return (
    <div>
      <NødvendigOpplæringAlert valgtVurdering={valgtVurdering} vurderingsliste={vurderingsliste} />
      <NavigationWithDetailView
        navigationSection={() => (
          <>
            <Vurderingsnavigasjon<OpplæringVurderingselement>
              perioder={vurderingsliste || []}
              onPeriodeClick={setValgtVurdering}
              valgtPeriode={valgtVurdering}
            />
          </>
        )}
        showDetailSection
        detailSection={() => (valgtVurdering ? <NødvendigOpplæringContainer vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default NødvendigOpplæring;
