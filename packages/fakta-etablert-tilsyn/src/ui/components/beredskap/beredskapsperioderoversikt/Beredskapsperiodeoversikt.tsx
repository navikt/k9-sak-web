import * as React from 'react';
import { useEffect } from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import BeredskapType from '../../../../types/BeredskapType';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Periodenavigasjon from '../../periodenavigasjon/Periodenavigasjon';
import BeredskapsperiodeoversiktController from '../beredskapsperiodeoversikt-controller/BeredskapsperiodeoversiktController';
import BeredskapsperiodeoversiktMessages from '../beredskapsperiodeoversikt-messages/BeredskapsperiodeoversiktMessages';

interface BeredskapsperiodeoversiktProps {
  beredskapData: BeredskapType;
}

const Beredskapsperiodeoversikt = ({ beredskapData }: BeredskapsperiodeoversiktProps) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<Vurderingsperiode>(null);
  const [editMode, setEditMode] = React.useState(false);
  const { beskrivelser } = beredskapData;

  const perioderTilVurdering = beredskapData.finnPerioderTilVurdering();
  const vurderteBeredskapsperioder = beredskapData.finnVurdertePerioder();

  const velgPeriode = (periode: Vurderingsperiode) => {
    setValgtPeriode(periode);
    setEditMode(false);
  };

  useEffect(() => {
    if (beredskapData.harPerioderTilVurdering()) {
      setValgtPeriode(perioderTilVurdering[0]);
    }
  }, []);

  return (
    <>
      <BeredskapsperiodeoversiktMessages beredskapData={beredskapData} />
      <NavigationWithDetailView
        navigationSection={() => (
          <Periodenavigasjon
            perioderTilVurdering={perioderTilVurdering}
            vurdertePerioder={vurderteBeredskapsperioder}
            onPeriodeValgt={velgPeriode}
            harValgtPeriode={valgtPeriode !== null}
          />
        )}
        showDetailSection={!!valgtPeriode}
        detailSection={() => (
          <BeredskapsperiodeoversiktController
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

export default Beredskapsperiodeoversikt;
