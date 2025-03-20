import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import Vurderingsnavigasjon, {
  Resultat,
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { Heading } from '@navikt/ds-react';
import { Period } from '@fpsak-frontend/utils';
import { useState } from 'react';

const VurderSykdomUperiodisert = () => {
  const mockElementer = [
    {
      periode: { fom: '2024-01-01', tom: '2024-01-31' },
      resultat: Resultat.OPPFYLT,
    },
    {
      periode: { fom: '2024-02-01', tom: '2024-02-29' },
      resultat: Resultat.IKKE_GODKJENT_AUTOMATISK,
    },
  ];
  const vurderingsliste = mockElementer.map(element => ({
    ...element,
    perioder: element.periode ? [new Period(element.periode.fom, element.periode.tom)] : [],
  }));

  const [valgtPeriode, setValgtPeriode] = useState<Vurderingselement | null>(null);

  return (
    <NavigationWithDetailView
      navigationSection={() => (
        <Vurderingsnavigasjon
          perioderTilVurdering={vurderingsliste || []}
          vurdertePerioder={[]}
          onPeriodeClick={setValgtPeriode}
        />
      )}
      showDetailSection={!!valgtPeriode}
      detailSection={() => (
        <div>
          <Heading size="small">Valgt vurdering</Heading>
          <div>
            <p>Periode:</p>
            <p>Resultat: {valgtPeriode?.resultat}</p>
          </div>
        </div>
      )}
    />
  );
};

export default VurderSykdomUperiodisert;
