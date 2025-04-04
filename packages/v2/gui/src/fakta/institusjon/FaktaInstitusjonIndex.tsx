import {
  InstitusjonVurderingDtoResultat,
  type InstitusjonPeriodeDto,
  type InstitusjonVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { Heading } from '@navikt/ds-react';
import { Period } from '@navikt/ft-utils';
import { useMemo, useState } from 'react';

import { NavigationWithDetailView } from '../../shared/navigationWithDetailView/NavigationWithDetailView.js';
import InstitusjonDetails from './components/institusjonDetails/InstitusjonDetails.js';
import type { SubmitValues } from './components/institusjonDetails/InstitusjonForm.js';
import InstitusjonNavigation from './components/institusjonNavigation/InstitusjonNavigation.js';
import type { InstitusjonPerioderDtoMedResultat } from './types/InstitusjonPerioderDtoMedResultat.js';
import type { InstitusjonVurderingDtoMedPerioder } from './types/InstitusjonVurderingDtoMedPerioder.js';

interface OwnProps {
  perioder: InstitusjonPeriodeDto[];
  vurderinger: InstitusjonVurderingDto[];
  readOnly: boolean;
  løsAksjonspunkt: (payload: SubmitValues) => void;
}

const FaktaInstitusjonIndex = ({ perioder, vurderinger, readOnly, løsAksjonspunkt }: OwnProps) => {
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
          periode: periodObj,
          perioder: [periodObj],
          resultat: vurdering?.resultat ?? InstitusjonVurderingDtoResultat.MÅ_VURDERES,
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

  return (
    <div style={{ fontSize: '16px' }}>
      <div className="mb-7">
        <Heading size="small">Institusjon</Heading>
      </div>

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

export default FaktaInstitusjonIndex;
