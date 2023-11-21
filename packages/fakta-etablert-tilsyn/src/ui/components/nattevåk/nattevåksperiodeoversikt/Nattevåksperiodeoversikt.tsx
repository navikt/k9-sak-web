import * as React from 'react';
import { useEffect } from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import NattevåkType from '../../../../types/NattevåkType';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Periodenavigasjon from '../../periodenavigasjon/Periodenavigasjon';
import NattevåksperiodeoversiktController from '../nattevåksperiodeoversikt-controller/NattevåksperiodeoversiktController';
import NattevåksperiodeoversiktMessages from '../nattevåksperiodeoversikt-messages/NattevåksperiodeoversiktMessages';

interface NattevåksperiodeoversiktProps {
  nattevåkData: NattevåkType;
}

const Nattevåksperiodeoversikt = ({ nattevåkData }: NattevåksperiodeoversiktProps) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<Vurderingsperiode>(null);
  const [editMode, setEditMode] = React.useState(false);
  const { beskrivelser } = nattevåkData;

  const perioderTilVurdering = nattevåkData.finnPerioderTilVurdering();
  const vurderteNattevåksperioder = nattevåkData.finnVurdertePerioder();

  const velgPeriode = (periode: Vurderingsperiode) => {
    setValgtPeriode(periode);
    setEditMode(false);
  };

  useEffect(() => {
    if (nattevåkData.harPerioderTilVurdering()) {
      setValgtPeriode(perioderTilVurdering[0]);
    }
  }, []);

  return (
    <>
      <NattevåksperiodeoversiktMessages nattevåkData={nattevåkData} />
      <NavigationWithDetailView
        navigationSection={() => (
          <Periodenavigasjon
            perioderTilVurdering={perioderTilVurdering}
            vurdertePerioder={vurderteNattevåksperioder}
            onPeriodeValgt={velgPeriode}
            harValgtPeriode={valgtPeriode !== null}
          />
        )}
        showDetailSection={!!valgtPeriode}
        detailSection={() => (
          <NattevåksperiodeoversiktController
            valgtPeriode={valgtPeriode}
            editMode={editMode}
            onEditClick={() => setEditMode(true)}
            onCancelClick={() => velgPeriode(null)}
            beskrivelser={beskrivelser}
          />
        )}
      />
    </>
  );
};

export default Nattevåksperiodeoversikt;
