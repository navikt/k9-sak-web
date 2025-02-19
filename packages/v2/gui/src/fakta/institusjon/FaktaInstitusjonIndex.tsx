import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import { Heading } from '@navikt/ds-react';
import type { InstitusjonPeriode, InstitusjonPerioderMedResultat, InstitusjonVurdering } from '@k9-sak-web/types';
import { Vurderingsresultat } from '@k9-sak-web/types';
import { Period } from '@fpsak-frontend/utils';
import InstitusjonNavigation from './components/institusjonNavigation/InstitusjonNavigation';
import InstitusjonDetails from './components/institusjonDetails/InstitusjonDetails';
import { useState, useMemo } from 'react';

interface OwnProps {
  perioder: InstitusjonPeriode[];
  vurderinger: InstitusjonVurdering[];
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
}

const InstitusjonOversikt = ({ perioder, vurderinger, readOnly, løsAksjonspunkt }: OwnProps) => {
  const [valgtPeriode, setValgtPeriode] = useState<InstitusjonPerioderMedResultat | null>(null);

  const vurderingMap = useMemo(() => new Map(vurderinger.map(v => [v.journalpostId.journalpostId, v])), [vurderinger]);

  const perioderMappet = useMemo(() => {
    const grouped = new Map<string, InstitusjonPerioderMedResultat>();

    perioder.forEach(periode => {
      const { journalpostId } = periode;
      const id = journalpostId.journalpostId;

      if (!id) return;

      const vurdering = vurderingMap.get(id);
      const existing = grouped.get(id);

      const periodObj = new Period(periode.periode.fom ?? '', periode.periode.tom ?? '');

      if (existing) {
        existing.perioder.push(periodObj);
      } else {
        grouped.set(id, {
          ...periode,
          periode: periodObj,
          perioder: [periodObj],
          resultat: vurdering?.resultat ?? Vurderingsresultat.MÅ_VURDERES,
        });
      }
    });

    return Array.from(grouped.values());
  }, [perioder, vurderingMap]);

  const valgtVurdering = (() => {
    const vurdering = valgtPeriode && vurderingMap.get(valgtPeriode.journalpostId.journalpostId);
    if (!vurdering) return undefined;

    return {
      ...vurdering,
      institusjon: valgtPeriode.institusjon,
      perioder: vurdering.perioder.map(p => new Period(p.fom ?? '', p.tom ?? '')),
    };
  })();

  return (
    <div style={{ fontSize: '16px' }}>
      <Heading className="mb-7" size="small">
        Institusjon
      </Heading>

      <NavigationWithDetailView
        navigationSection={() => <InstitusjonNavigation perioder={perioderMappet} setValgtPeriode={setValgtPeriode} />}
        showDetailSection
        detailSection={() =>
          valgtVurdering ? (
            <InstitusjonDetails vurdering={valgtVurdering} readOnly={readOnly} løsAksjonspunkt={løsAksjonspunkt} />
          ) : null
        }
      />
    </div>
  );
};

export default InstitusjonOversikt;
