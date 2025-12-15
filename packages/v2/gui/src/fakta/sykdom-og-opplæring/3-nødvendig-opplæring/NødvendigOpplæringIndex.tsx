import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/Vurderingsnavigasjon';
import { useVurdertOpplæring } from '../SykdomOgOpplæringQueries';
import { useContext, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Period } from '@navikt/ft-utils';
import { type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import NødvendigOpplæringContainer from './NødvendigOpplæringContainer';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import { CenteredLoader } from '../CenteredLoader';
import NødvendigOpplæringAlert from './NødvendigOpplæringAlerts';
import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated/types.js';

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

  const andrePerioderTilVurdering =
    vurderingsliste && valgtVurdering
      ? vurderingsliste
          .filter(v => !v.perioder.some(p => valgtVurdering.perioder.some(vp => p.fom === vp.fom && p.tom === vp.tom)))
          .filter(v => v.resultat === OpplæringVurderingDtoResultat.MÅ_VURDERES)
          .flatMap(v => v.perioder.map(p => ({ fom: p.fom, tom: p.tom })))
      : [];

  if (isLoadingVurdertOpplæring) {
    return <CenteredLoader />;
  }
  return (
    <div>
      <NødvendigOpplæringAlert vurderingsliste={vurderingsliste} />
      <NavigationWithDetailView
        navigationSection={() => (
          <>
            <Vurderingsnavigasjon<OpplæringVurderingselement>
              nyesteFørst={false}
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
