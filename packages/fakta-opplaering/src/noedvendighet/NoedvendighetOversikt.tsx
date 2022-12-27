import React, { useContext } from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import { Heading } from '@navikt/ds-react';
import { NoedvendighetPeriode, NoedvendighetPerioder, NoedvendighetVurdering } from '@k9-sak-web/types';
import { Period } from '@navikt/k9-period-utils';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import NoedvendighetNavigation from './NoedvendighetNavigation';
import NoedvendighetDetails from './NoedvendighetDetails';

interface OwnProps {
  perioder: NoedvendighetPeriode[];
  vurderinger: NoedvendighetVurdering[];
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
}

const reducer = (accumulator, currentValue) => {
  const perioderMedMatchendeJournalpostId = accumulator.find(
    periode => periode.journalpostId.journalpostId === currentValue.journalpostId.journalpostId,
  );
  if (perioderMedMatchendeJournalpostId) {
    const arrayUtenPeriodeneSomSkalLeggesInn = accumulator.filter(
      periode => periode.journalpostId.journalpostId !== currentValue.journalpostId.journalpostId,
    );
    return [
      ...arrayUtenPeriodeneSomSkalLeggesInn,
      {
        noedvendighet: perioderMedMatchendeJournalpostId.noedvendighet,
        journalpostId: perioderMedMatchendeJournalpostId.journalpostId,
        resultat: perioderMedMatchendeJournalpostId.resultat,
        perioder: [...perioderMedMatchendeJournalpostId.perioder, currentValue.periode],
      },
    ];
  }
  return [
    ...accumulator,
    {
      noedvendighet: currentValue.noedvendighet,
      journalpostId: currentValue.journalpostId,
      resultat: currentValue.resultat,
      perioder: [currentValue.periode],
    },
  ];
};

const NoedvendighetOversikt = () => {
  const { nødvendigOpplæring } = useContext(FaktaOpplaeringContext);
  const { vurderinger, perioder } = nødvendigOpplæring;
  const [valgtPeriode, setValgtPeriode] = React.useState<NoedvendighetPerioder>(null);
  const perioderMappet = perioder
    .map(periode => {
      const vurderingForPeriode = vurderinger.find(
        vurdering => vurdering.journalpostId.journalpostId === periode.journalpostId.journalpostId,
      );
      return {
        ...periode,
        periode: new Period(periode.periode.fom, periode.periode.tom),
        resultat: vurderingForPeriode?.resultat,
      };
    })
    .reduce(reducer, []);

  const vurderingerMappet = vurderinger.map(vurdering => {
    const periodeForVurdering = perioder.find(
      periode => periode.journalpostId.journalpostId === vurdering.journalpostId.journalpostId,
    );
    return {
      ...vurdering,
      perioder: vurdering.perioder.map(v => new Period(v.fom, v.tom)),
      noedvendighet: periodeForVurdering.noedvendighet,
    };
  });

  const valgtVurdering = vurderingerMappet.find(
    vurdering => vurdering.journalpostId.journalpostId === valgtPeriode?.journalpostId?.journalpostId,
  );

  return (
    <div style={{ fontSize: '16px' }}>
      <NavigationWithDetailView
        navigationSection={() => (
          <NoedvendighetNavigation perioder={perioderMappet} setValgtPeriode={setValgtPeriode} />
        )}
        showDetailSection
        detailSection={() => (valgtVurdering ? <NoedvendighetDetails vurdering={valgtVurdering} /> : null)}
      />
    </div>
  );
};

export default NoedvendighetOversikt;
