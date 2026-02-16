import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigation-with-detail-view/NavigationWithDetailView.js';
import { VStack } from '@navikt/ds-react';
import * as React from 'react';
import { useEffect } from 'react';
import type BeredskapType from '../../../../types/BeredskapType';
import type Vurderingsperiode from '../../../../types/Vurderingsperiode';
import ContainerContext from '../../../context/ContainerContext';
import Periodenavigasjon from '../../periodenavigasjon/Periodenavigasjon';
import BeredskapsperiodeoversiktController from '../beredskapsperiodeoversikt-controller/BeredskapsperiodeoversiktController';
import BeredskapsperiodeoversiktMessages from '../beredskapsperiodeoversikt-messages/BeredskapsperiodeoversiktMessages';

interface BeredskapsperiodeoversiktProps {
  beredskapData: BeredskapType;
}

const Beredskapsperiodeoversikt = ({ beredskapData }: BeredskapsperiodeoversiktProps) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<Vurderingsperiode | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const { beskrivelser } = beredskapData;
  const {
    lagreBeredskapvurdering = () => {},
    readOnly = false,
    harAksjonspunktForBeredskap = false,
  } = React.useContext(ContainerContext) || {};

  const perioderTilVurdering = beredskapData.finnPerioderTilVurdering();
  const vurderteBeredskapsperioder = beredskapData.finnVurdertePerioder();

  const velgPeriode = (periode: Vurderingsperiode | null) => {
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
        detailSection={() =>
          valgtPeriode && (
            <BeredskapsperiodeoversiktController
              valgtPeriode={valgtPeriode}
              editMode={editMode}
              onEditClick={() => setEditMode(true)}
              onCancelClick={() => velgPeriode(null)}
              beskrivelser={beskrivelser}
            />
          )
        }
      />
    </VStack>
  );
};

export default Beredskapsperiodeoversikt;
