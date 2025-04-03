import Vurderingsnavigasjon from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { useVurdertReisetid } from '../SykdomOgOpplæringQueries';
import { useContext, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Period } from '@navikt/ft-utils';
import type { ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import ReisetidContainer from './ReisetidContainer';
import { NavigationWithDetailView } from '../../../shared/NavigationWithDetailView/NavigationWithDetailView';

const ReisetidIndex = () => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: vurdertReisetid } = useVurdertReisetid(behandlingUuid);
  const [valgtVurdering, setValgtVurdering] = useState<(ReisetidVurderingDto & { perioder: Period[] }) | null>(null);

  const vurderingsliste = vurdertReisetid?.vurderinger.map(vurdering => ({
    ...vurdering,
    resultat: vurdering.reisetid.resultat,
    perioder: [new Period(vurdering.reisetid.periode.fom, vurdering.reisetid.periode.tom)],
  })) as (ReisetidVurderingDto & { perioder: Period[] })[];

  return (
    <div>
      <NavigationWithDetailView
        navigationSection={() => (
          <>
            <Vurderingsnavigasjon<ReisetidVurderingDto & { perioder: Period[] }>
              perioderTilVurdering={vurderingsliste || []}
              vurdertePerioder={[]}
              onPeriodeClick={setValgtVurdering}
            />
          </>
        )}
        detailSection={() => (valgtVurdering ? <ReisetidContainer vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default ReisetidIndex;
