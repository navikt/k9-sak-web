import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigation-with-detail-view/NavigationWithDetailView.js';
import * as React from 'react';
import { useEffect } from 'react';
import NattevåkType from '../../../../types/NattevåkType';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Periodenavigasjon from '../../periodenavigasjon/Periodenavigasjon';
import NattevåksperiodeoversiktController from '../nattevåksperiodeoversikt-controller/NattevåksperiodeoversiktController';
import NattevåksperiodeoversiktMessages from '../nattevåksperiodeoversikt-messages/NattevåksperiodeoversiktMessages';
import ContainerContext from '../../../context/ContainerContext';

interface NattevåksperiodeoversiktProps {
  nattevåkData: NattevåkType;
}

const Nattevåksperiodeoversikt = ({ nattevåkData }: NattevåksperiodeoversiktProps) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<Vurderingsperiode | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const { beskrivelser } = nattevåkData;
  const {
    lagreNattevåkvurdering = () => {},
    readOnly = false,
    harUløstAksjonspunktForNattevåk = false,
  } = React.useContext(ContainerContext) || {};

  const perioderTilVurdering = nattevåkData.finnPerioderTilVurdering();
  const vurderteNattevåksperioder = nattevåkData.finnVurdertePerioder();

  const velgPeriode = (periode: Vurderingsperiode | null) => {
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
      <NattevåksperiodeoversiktMessages
        nattevåkData={nattevåkData}
        skalViseFortsettUtenEndring={!readOnly && harUløstAksjonspunktForNattevåk}
        fortsettUtenEndring={() => lagreNattevåkvurdering(nattevåkData.vurderinger)}
      />
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
        detailSection={() =>
          valgtPeriode && (
            <NattevåksperiodeoversiktController
              valgtPeriode={valgtPeriode}
              editMode={editMode}
              onEditClick={() => setEditMode(true)}
              onCancelClick={() => velgPeriode(null)}
              beskrivelser={beskrivelser}
            />
          )
        }
      />
    </>
  );
};

export default Nattevåksperiodeoversikt;
