import * as React from 'react';
import { useEffect } from 'react';
import { VStack } from '@navikt/ds-react';
import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigation-with-detail-view/NavigationWithDetailView.js';
import BeredskapType from '../../../../types/BeredskapType';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Periodenavigasjon from '../../periodenavigasjon/Periodenavigasjon';
import BeredskapsperiodeoversiktController from '../beredskapsperiodeoversikt-controller/BeredskapsperiodeoversiktController';
import BeredskapsperiodeoversiktMessages from '../beredskapsperiodeoversikt-messages/BeredskapsperiodeoversiktMessages';
import ContainerContext from '../../../context/ContainerContext';

interface BeredskapsperiodeoversiktProps {
  beredskapData: BeredskapType;
}

const Beredskapsperiodeoversikt = ({ beredskapData }: BeredskapsperiodeoversiktProps) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<Vurderingsperiode>(null);
  const [editMode, setEditMode] = React.useState(false);
  const { beskrivelser } = beredskapData;
  const {
    lagreBeredskapvurdering = () => {},
    readOnly = false,
    harAksjonspunktForBeredskap = false,
  } = React.useContext(ContainerContext) || {};

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
    <VStack gap="6">
      <BeredskapsperiodeoversiktMessages
        beredskapData={beredskapData}
        skalViseFortsettUtenEndring={!readOnly && harAksjonspunktForBeredskap}
        fortsettUtenEndring={() => lagreBeredskapvurdering(beredskapData.vurderinger)}
      />
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
    </VStack>
  );
};

export default Beredskapsperiodeoversikt;
