import * as React from 'react';
import type Beskrivelse from '../../../../types/Beskrivelse';
import type Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';
import NattevåksperiodeVurderingsdetaljer from '../nattevåksperiode-vurderingsdetaljer/NattevåksperiodeVurderingsdetaljer';
import VurderingAvNattevåksperioderForm from '../vurdering-av-nattevåksperioder-form/VurderingAvNattevåksperioderForm';

interface NattevåksperiodeoversiktControllerProps {
  valgtPeriode: Vurderingsperiode;
  editMode: boolean;
  onEditClick: () => void;
  onCancelClick: () => void;
  beskrivelser: Beskrivelse[];
}

const NattevåksperiodeoversiktController = ({
  valgtPeriode,
  editMode,
  onEditClick,
  onCancelClick,
  beskrivelser,
}: NattevåksperiodeoversiktControllerProps) => {
  if (valgtPeriode.resultat !== Vurderingsresultat.IKKE_VURDERT && !editMode) {
    return (
      <NattevåksperiodeVurderingsdetaljer
        nattevåksperiode={valgtPeriode}
        onEditClick={onEditClick}
        beskrivelser={beskrivelser}
      />
    );
  }
  return (
    <VurderingAvNattevåksperioderForm
      key={valgtPeriode.id}
      nattevåksperiode={valgtPeriode}
      onCancelClick={onCancelClick}
      beskrivelser={beskrivelser}
    />
  );
};

export default NattevåksperiodeoversiktController;
