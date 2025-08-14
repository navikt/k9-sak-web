import { useState, useMemo, useContext } from 'react';
import { Period } from '@navikt/ft-utils';
import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonResultat,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonPeriodeDto as InstitusjonPeriodeDto,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonVurderingDto as InstitusjonVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';

import InstitusjonDetails from './components/InstitusjonDetails.js';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView.js';
import type { InstitusjonPerioderDtoMedResultat } from './types/InstitusjonPerioderDtoMedResultat.js';
import type { InstitusjonVurderingDtoMedPerioder } from './types/InstitusjonVurderingDtoMedPerioder.js';
import { useInstitusjonInfo } from '../SykdomOgOpplæringQueries.js';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex.js';
import VurderingsperiodeNavigasjon from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon.js';
import { CenteredLoader } from '../CenteredLoader.js';
import { Alert, Button } from '@navikt/ds-react';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils.js';
import { utledGodkjentInstitusjon } from './utils.js';

export interface FaktaInstitusjonProps {
  perioder: InstitusjonPeriodeDto[];
  vurderinger: InstitusjonVurderingDto[];
  readOnly: boolean;
}

const FaktaInstitusjonIndex = () => {
  const { behandlingUuid, readOnly, aksjonspunkter, løsAksjonspunkt9300 } = useContext(SykdomOgOpplæringContext);
  const { data: institusjonData, isLoading } = useInstitusjonInfo(behandlingUuid);
  const { perioder = [], vurderinger = [] } = institusjonData ?? {};
  const [valgtPeriode, setValgtPeriode] = useState<InstitusjonPerioderDtoMedResultat | null>(null);
  const vurderingMap = useMemo(() => new Map(vurderinger.map(v => [v.journalpostId.journalpostId, v])), [vurderinger]);

  const alleVurderingerErGjort = vurderinger.every(vurdering => vurdering.resultat !== InstitusjonResultat.MÅ_VURDERES);
  const harÅpentAksjonspunkt = aksjonspunkter.some(
    aksjonspunkt =>
      aksjonspunkt.definisjon.kode === AksjonspunktCodes.VURDER_INSTITUSJON &&
      isAksjonspunktOpen(aksjonspunkt.status.kode),
  );
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

  const løsAksjonspunktUtenEndringer = () => {
    if (vurderinger.length === 0) return;

    løsAksjonspunkt9300({
      godkjent: utledGodkjentInstitusjon(vurderinger[0]?.resultat) === 'ja' ? true : false,
      journalpostId: {
        journalpostId: vurderinger[0]?.journalpostId.journalpostId ?? '',
      },
      begrunnelse: vurderinger[0]?.begrunnelse ?? '',
    });
  };

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
      {valgtVurdering?.resultat === InstitusjonResultat.MÅ_VURDERES && !readOnly && (
        <Alert variant="warning" size="small" contentMaxWidth={false} className="mb-4 p-4">
          {`Vurder om opplæringen er utført ved godkjent helseinstitusjon eller kompetansesenter i perioden ${valgtVurdering.perioder.map(periode => periode.prettifyPeriod()).join(', ')}.`}
        </Alert>
      )}
      {alleVurderingerErGjort && harÅpentAksjonspunkt && !readOnly && (
        <Alert variant="info" size="small" className="mb-4 p-4">
          Institusjoner er ferdig vurdert og du kan gå videre i behandlingen.
          <div className="mt-2">
            <Button variant="secondary" size="small" onClick={løsAksjonspunktUtenEndringer}>
              Bekreft og fortsett
            </Button>
          </div>
        </Alert>
      )}

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
