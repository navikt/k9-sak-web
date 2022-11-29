import * as React from 'react';
import { useEffect } from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import { Heading } from '@navikt/ds-react';
import { InstitusjonPeriode, InstitusjonVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { Period } from '@navikt/k9-period-utils';
import InstitusjonNavigation from './InstitusjonNavigation';

interface OwnProps {
  perioder: InstitusjonPeriode[];
  vurderinger: InstitusjonVurdering[];
}

const InstitusjonOversikt = ({ perioder, vurderinger }: OwnProps) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<string>(null);

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
    console.log(vurderinger);
    console.log(perioder);
    const periodeForVurdering = perioder.find(
      periode => periode.journalpostId.journalpostId === vurdering.journalpostId.journalpostId,
    );
    return {
      ...vurdering,
      periode: new Period(periodeForVurdering.periode.fom, periodeForVurdering.periode.tom),
    };
  });
  return (
    <>
      <Heading style={{ marginBottom: '1.625rem' }} size="small">
        Institusjon
      </Heading>
      <NavigationWithDetailView
        navigationSection={() => <InstitusjonNavigation perioder={perioderMappet} setValgtPeriode={setValgtPeriode} />}
        showDetailSection
        detailSection={() => <>details</>}
      />
    </>
  );
};

export default InstitusjonOversikt;
