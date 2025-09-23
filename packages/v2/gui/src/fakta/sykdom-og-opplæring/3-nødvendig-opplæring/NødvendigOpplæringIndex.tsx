import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { useVurdertOpplæring } from '../SykdomOgOpplæringQueries';
import { useContext, useEffect, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Period } from '@navikt/ft-utils';
import { type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
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
  const [andrePerioderTilVurdering, setAndrePerioderTilVurdering] = useState<{ fom: string; tom: string }[]>([]);
  useEffect(() => {
    if (vurderingsliste && valgtVurdering) {
      setAndrePerioderTilVurdering(
        vurderingsliste
          .filter(v => !v.perioder.some(p => valgtVurdering.perioder.some(vp => p.fom === vp.fom && p.tom === vp.tom)))
          .flatMap(v => v.perioder.map(p => ({ fom: p.fom, tom: p.tom }))),
      );
    }
  }, [valgtVurdering]);

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
        detailSection={() =>
          valgtVurdering ? (
            <NødvendigOpplæringContainer
              vurdering={valgtVurdering}
              andrePerioderTilVurdering={andrePerioderTilVurdering}
            />
          ) : null
        }
      />
    </div>
  );
};

export default NødvendigOpplæring;
