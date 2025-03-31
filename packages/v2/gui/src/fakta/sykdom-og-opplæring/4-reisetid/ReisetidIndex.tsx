import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import Vurderingsnavigasjon from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { useVurdertReisetid } from '../SykdomOgOpplæringQueries';
import { useContext, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Period } from '@navikt/ft-utils';
import type { ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import ReisetidContainer from './ReisetidContainer';

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
            <Vurderingsnavigasjon
              perioderTilVurdering={vurderingsliste || []}
              vurdertePerioder={[]}
              onPeriodeClick={setValgtVurdering}
            />
          </>
        )}
        showDetailSection={true}
        detailSection={() => (valgtVurdering ? <ReisetidContainer vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default ReisetidIndex;
