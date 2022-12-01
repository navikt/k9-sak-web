import * as React from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import { Heading } from '@navikt/ds-react';
import {
  InstitusjonPeriode,
  InstitusjonPeriodeMedResultat,
  InstitusjonVurdering,
  Vurderingsresultat,
} from '@k9-sak-web/types';
import { Period } from '@navikt/k9-period-utils';
import InstitusjonNavigation from './InstitusjonNavigation';
import InstitusjonDetails from './InstitusjonDetails';

interface OwnProps {
  perioder: InstitusjonPeriode[];
  vurderinger: InstitusjonVurdering[];
  readOnly: boolean;
}

const InstitusjonOversikt = ({ perioder, vurderinger, readOnly }: OwnProps) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<InstitusjonPeriodeMedResultat>(null);

  const perioderMappet = perioder.map(periode => {
    const vurderingForPeriode = vurderinger.find(
      vurdering => vurdering.journalpostId.journalpostId === periode.journalpostId.journalpostId,
    );
    const resultat = vurderingForPeriode ? vurderingForPeriode.resultat : Vurderingsresultat.IKKE_OPPFYLT;
    return {
      ...periode,
      periode: new Period(periode.periode.fom, periode.periode.tom),
      resultat,
    };
  });

  const vurderingerMappet = vurderinger.map(vurdering => {
    const periodeForVurdering = perioder.find(
      periode => periode.journalpostId.journalpostId === vurdering.journalpostId.journalpostId,
    );
    return {
      ...vurdering,
      periode: new Period(periodeForVurdering.periode.fom, periodeForVurdering.periode.tom),
      institusjon: periodeForVurdering.institusjon,
    };
  });

  const valgtVurdering = vurderingerMappet.find(
    vurdering => vurdering.journalpostId.journalpostId === valgtPeriode?.journalpostId?.journalpostId,
  );

  return (
    <div style={{ fontSize: '16px' }}>
      <Heading style={{ marginBottom: '1.625rem' }} size="small">
        Institusjon
      </Heading>
      <NavigationWithDetailView
        navigationSection={() => <InstitusjonNavigation perioder={perioderMappet} setValgtPeriode={setValgtPeriode} />}
        showDetailSection
        detailSection={() =>
          valgtVurdering ? <InstitusjonDetails vurdering={valgtVurdering} readOnly={readOnly} /> : null
        }
      />
    </div>
  );
};

export default InstitusjonOversikt;
