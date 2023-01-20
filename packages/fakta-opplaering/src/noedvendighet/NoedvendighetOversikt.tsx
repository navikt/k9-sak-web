import React, { useContext } from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import { Alert } from '@navikt/ds-react';
import { NoedvendighetPerioder, NoedvendighetVurdering } from '@k9-sak-web/types';
import { Period } from '@navikt/k9-period-utils';
import {
  FaktaOpplaeringContext,
  FaktaOpplaeringContextTypes,
} from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import NoedvendighetNavigation from './NoedvendighetNavigation';
import NoedvendighetDetails from './NoedvendighetDetails';

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
  const { nødvendigOpplæring, aksjonspunkter } = useContext<FaktaOpplaeringContextTypes>(FaktaOpplaeringContext);
  const { vurderinger, perioder } = nødvendigOpplæring;
  const [valgtPeriode, setValgtPeriode] = React.useState<NoedvendighetVurdering>(null);
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

  const andreAksjonspunkterIOpplæring = aksjonspunkter
    .filter(aksjonspunkt => aksjonspunkt.definisjon.kode !== aksjonspunktCodes.VURDER_NØDVENDIGHET)
    .map(aksjonspunkt => {
      if (aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING) {
        return 'Opplæring';
      }

      if (aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_REISETID) {
        return 'Reisetid';
      }
      return aksjonspunkt;
    })
    .filter(v => typeof v === 'string');

  if (!aksjonspunkter.find(aksjonspunkt => aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_NØDVENDIGHET)) {
    return (
      <Alert variant="info">
        {`${andreAksjonspunkterIOpplæring.join(' og ')} må vurderes før Nødvendighet kan vurderes.`}
      </Alert>
    );
  }
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
