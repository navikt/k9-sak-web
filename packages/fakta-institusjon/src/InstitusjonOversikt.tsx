import * as React from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import { Heading } from '@navikt/ds-react';
import { InstitusjonPeriode, InstitusjonPerioderMedResultat, InstitusjonVurdering } from '@k9-sak-web/types';
import { Period } from '@navikt/k9-fe-period-utils';
import InstitusjonNavigation from './InstitusjonNavigation';
import InstitusjonDetails from './InstitusjonDetails';

interface OwnProps {
  perioder: InstitusjonPeriode[];
  vurderinger: InstitusjonVurdering[];
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
  saksbehandlere: { [key: string]: string };
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
        institusjon: perioderMedMatchendeJournalpostId.institusjon,
        journalpostId: perioderMedMatchendeJournalpostId.journalpostId,
        resultat: perioderMedMatchendeJournalpostId.resultat,
        perioder: [...perioderMedMatchendeJournalpostId.perioder, currentValue.periode],
      },
    ];
  }
  return [
    ...accumulator,
    {
      institusjon: currentValue.institusjon,
      journalpostId: currentValue.journalpostId,
      resultat: currentValue.resultat,
      perioder: [currentValue.periode],
    },
  ];
};

const InstitusjonOversikt = ({ perioder, vurderinger, readOnly, løsAksjonspunkt, saksbehandlere }: OwnProps) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<InstitusjonPerioderMedResultat>(null);

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
          valgtVurdering ? (
            <InstitusjonDetails
              vurdering={valgtVurdering}
              readOnly={readOnly}
              løsAksjonspunkt={løsAksjonspunkt}
              saksbehandlere={saksbehandlere}
            />
          ) : null
        }
      />
    </div>
  );
};

export default InstitusjonOversikt;
