import { useState, useMemo, useContext } from 'react';
import { Period } from '@navikt/ft-utils';
import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonResultat } from '@k9-sak-web/backend/k9sak/generated/types.js';

import InstitusjonDetails from './components/InstitusjonDetails.js';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView.js';
import type { InstitusjonPerioderDtoMedResultat } from './types/InstitusjonPerioderDtoMedResultat.js';
import type { InstitusjonVurderingDtoMedPerioder } from './types/InstitusjonVurderingDtoMedPerioder.js';
import { useInstitusjonInfo } from '../SykdomOgOpplæringQueries.js';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex.js';
import VurderingsperiodeNavigasjon from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon.js';
import { CenteredLoader } from '../CenteredLoader.js';
import InstitusjonAlerts from './components/InstitusjonAlerts.js';

const FaktaInstitusjonIndex = () => {
  const { behandlingUuid, readOnly } = useContext(SykdomOgOpplæringContext);
  const { data: institusjonData, isLoading } = useInstitusjonInfo(behandlingUuid);
  const { perioder = [], vurderinger = [] } = institusjonData ?? {};
  const [valgtPeriode, setValgtPeriode] = useState<InstitusjonPerioderDtoMedResultat | null>(null);
  const vurderingMap = useMemo(() => new Map(vurderinger.map(v => [v.journalpostId.journalpostId, v])), [vurderinger]);

  const perioderMappet = useMemo(() => {
    const grouped = new Map<string, InstitusjonPerioderDtoMedResultat>();

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
          perioder: [periodObj],
          resultat: vurdering?.resultat ?? InstitusjonResultat.MÅ_VURDERES,
        });
      }
    });

    return Array.from(grouped.values());
  }, [perioder, vurderingMap]);

  const valgtVurdering: InstitusjonVurderingDtoMedPerioder | undefined = (() => {
    const vurdering = valgtPeriode && vurderingMap.get(valgtPeriode.journalpostId.journalpostId);
    if (!vurdering) return undefined;

    return {
      ...vurdering,
      institusjon: valgtPeriode.institusjon,
      perioder: vurdering.perioder.map(p => new Period(p.fom ?? '', p.tom ?? '')),
    };
  })();

  if (isLoading) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <InstitusjonAlerts valgtVurdering={valgtVurdering} vurderinger={vurderinger} />
      <NavigationWithDetailView
        navigationSection={() => (
          <VurderingsperiodeNavigasjon<InstitusjonPerioderDtoMedResultat>
            valgtPeriode={valgtPeriode}
            perioder={perioderMappet}
            onPeriodeClick={setValgtPeriode}
          />
        )}
        detailSection={() =>
          valgtVurdering ? <InstitusjonDetails vurdering={valgtVurdering} readOnly={readOnly} /> : null
        }
        showDetailSection
      />
    </div>
  );
};

export default FaktaInstitusjonIndex;
