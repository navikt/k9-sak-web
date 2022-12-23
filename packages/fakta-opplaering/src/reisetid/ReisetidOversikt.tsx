import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { Period } from '@navikt/k9-period-utils';
import { ReisetidVurdering } from './ReisetidTypes';
import ReisetidNavigation from './ReisetidNavigation';
import ReisetidDetails from './ReisetidDetails';

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
    til: dayjs(vurdering.opplæringPeriode.fom).isSameOrBefore(dayjs(reisetidObj.periode.tom)),
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
