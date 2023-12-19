import React, { useContext } from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import { GjennomgaaOpplaeringPeriode, GjennomgaaOpplaeringVurdering } from '@k9-sak-web/types';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';

import { Period } from '@fpsak-frontend/utils';
import GjennomgaaOpplaeringNavigation from './GjennomgaaOpplaeringNavigation';
import GjennomgaaOpplaeringDetails from './GjennomgaaOpplaeringDetails';

const GjennomgaaOpplaeringOversikt = () => {
  const { gjennomgåttOpplæring } = useContext(FaktaOpplaeringContext);
  const { vurderinger } = gjennomgåttOpplæring;

  const [valgtPeriode, setValgtPeriode] = React.useState<GjennomgaaOpplaeringPeriode>(null);

  const vurderingerMappet = vurderinger.map(vurdering => ({
    ...vurdering,
    opplæring: new Period(vurdering.opplæring.fom, vurdering.opplæring.tom),
  })) as GjennomgaaOpplaeringVurdering[];

  const valgtVurdering = vurderingerMappet.find(
    vurdering => vurdering.opplæring.prettifyPeriod() === valgtPeriode?.opplæring?.prettifyPeriod(),
  );

  return (
    <div style={{ fontSize: '16px' }}>
      <NavigationWithDetailView
        navigationSection={() => (
          <GjennomgaaOpplaeringNavigation perioder={vurderingerMappet} setValgtPeriode={setValgtPeriode} />
        )}
        showDetailSection
        detailSection={() => (valgtVurdering ? <GjennomgaaOpplaeringDetails vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default GjennomgaaOpplaeringOversikt;
