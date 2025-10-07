import { Alert, Box, Button } from '@navikt/ds-react';
import NattevåkType from '../../../../types/NattevåkType';
import { getStringMedPerioder } from '../../../../util/periodUtils';
import React from 'react';
import ContainerContext from '../../../context/ContainerContext';

interface NattevåksperiodeoversiktMessagesProps {
  nattevåkData: NattevåkType;
  fortsettUtenEndring: () => void;
}

const NattevåksperiodeoversiktMessages = ({
  nattevåkData,
  fortsettUtenEndring,
}: NattevåksperiodeoversiktMessagesProps) => {
  const { readOnly, harAksjonspunktForNattevåk } = React.useContext(ContainerContext);

  if (!nattevåkData.harPerioder()) {
    return <p>Søker har ikke oppgitt at det er behov for nattevåk.</p>;
  }
  if (nattevåkData.harPerioderTilVurdering()) {
    const perioderTilVurdering = nattevåkData.finnPerioderTilVurdering().map(({ periode }) => periode);
    return (
      <Box.New marginBlock="0 6">
        <Alert size="small" variant="warning">
          {`Vurder behov for nattevåk i ${getStringMedPerioder(perioderTilVurdering)}.`}
        </Alert>
      </Box.New>
    );
  } else if (!readOnly && harAksjonspunktForNattevåk) {
    return (
      <Box.New marginBlock="0 6">
        <Alert size="small" data-testid="nattevåk-ferdig" variant="info">
          <div style={{ display: 'flex' }}>
            <>Behov for nattevåk er ferdig vurdert og du kan gå videre i vurderingen.</>
            <Button
              style={{ marginLeft: '2rem' }}
              onClick={fortsettUtenEndring}
              size="small"
              id="gåVidereFraNattevåkKnapp"
            >
              Fortsett
            </Button>
          </div>
        </Alert>
      </Box.New>
    );
  }
  return null;
};

export default NattevåksperiodeoversiktMessages;
