import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import Vurderingsnavigasjon from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { useVurdertReisetid } from '../SykdomOgOpplæringQueries';
import { useContext, useState } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { Period } from '@navikt/ft-utils';
import ReisetidForm from './ReisetidForm';
import type { ReisetidPeriodeVurderingDto } from '@k9-sak-web/backend/k9sak/generated';

const ReisetidIndex = () => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: vurdertReisetid } = useVurdertReisetid(behandlingUuid);
  const [valgtVurdering, setValgtVurdering] = useState<(ReisetidPeriodeVurderingDto & { perioder: Period[] }) | null>(
    null,
  );

  const vurderingsliste = vurdertReisetid?.vurderinger.map(vurdering => ({
    ...(vurdering.reisetid[0] as ReisetidPeriodeVurderingDto),
    perioder: [new Period(vurdering.reisetid[0]?.periode.fom as string, vurdering.reisetid[0]?.periode.tom as string)],
  })) as (ReisetidPeriodeVurderingDto & { perioder: Period[] })[];

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
        detailSection={() => (valgtVurdering ? <ReisetidForm vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default ReisetidIndex;
