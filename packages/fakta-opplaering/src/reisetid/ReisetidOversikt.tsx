import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';
import dayjs from 'dayjs';
import React, { useContext } from 'react';

import { Period } from '@fpsak-frontend/utils';
import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigationWithDetailView/NavigationWithDetailView.js';
import ReisetidDetails from './ReisetidDetails';
import ReisetidNavigation from './ReisetidNavigation';
import { ReisetidVurdering } from './ReisetidTypes';

const mapVurdering = (vurdering, reisetidObj, perioder) => {
  const perioderFraSoeknad = perioder.find(
    periode =>
      periode.opplæringPeriode.fom === vurdering.opplæringPeriode.fom &&
      periode.opplæringPeriode.tom === vurdering.opplæringPeriode.tom,
  );
  return {
    begrunnelse: reisetidObj.begrunnelse,
    resultat: reisetidObj.resultat,
    perioderFraSoeknad,
    periode: new Period(reisetidObj.periode.fom, reisetidObj.periode.tom),
    til: dayjs(reisetidObj.periode.fom).isSameOrBefore(dayjs(vurdering.opplæringPeriode.fom)),
  };
};

const ReisetidOversikt = () => {
  const { reisetid } = useContext(FaktaOpplaeringContext);
  const { vurderinger, perioder } = reisetid;

  const [valgtPeriode, setValgtPeriode] = React.useState<ReisetidVurdering>(null);

  const reducer = (acc, current) => {
    const mapFunc = reisetidPeriode => mapVurdering(current, reisetidPeriode, perioder);
    return [...acc, ...current.reisetidHjem.map(mapFunc), ...current.reisetidTil.map(mapFunc)];
  };

  const vurderingerMappet = vurderinger.reduce(reducer, []) as ReisetidVurdering[];

  const valgtVurdering = vurderingerMappet.find(
    vurdering => vurdering.periode.prettifyPeriod() === valgtPeriode?.periode?.prettifyPeriod(),
  );

  return (
    <div style={{ fontSize: '16px' }}>
      <NavigationWithDetailView
        navigationSection={() => <ReisetidNavigation perioder={vurderingerMappet} setValgtPeriode={setValgtPeriode} />}
        showDetailSection
        detailSection={() => (valgtVurdering ? <ReisetidDetails vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default ReisetidOversikt;
