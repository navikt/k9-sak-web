import { Alert, Box, Button } from '@navikt/ds-react';
import BeredskapType from '../../../../types/BeredskapType';
import { getStringMedPerioder } from '../../../../util/periodUtils';
import React from 'react';
import ContainerContext from '../../../context/ContainerContext';

interface BeredskapsperiodeoversiktMessagesProps {
  beredskapData: BeredskapType;
  fortsettUtenEndring: () => void;
}

const BeredskapsperiodeoversiktMessages = ({
  beredskapData,
  fortsettUtenEndring,
}: BeredskapsperiodeoversiktMessagesProps) => {
  const { readOnly, harAksjonspunktForBeredskap } = React.useContext(ContainerContext) || {};

  if (!beredskapData.harPerioder()) {
    return <p>Søker har ikke oppgitt at det er behov for beredskap.</p>;
  }
  if (beredskapData.harPerioderTilVurdering()) {
    const perioderTilVurdering = beredskapData.finnPerioderTilVurdering().map(({ periode }) => periode);
    return (
      <Box.New marginBlock="0 6">
        <Alert size="small" variant="warning">
          {`Vurder behov for beredskap i ${getStringMedPerioder(perioderTilVurdering)}.`}
        </Alert>
      </Box.New>
    );
  } else if (!readOnly && harAksjonspunktForBeredskap) {
    return (
      <Box.New marginBlock="0 6">
        <Alert size="small" data-testid="nattevåk-ferdig" variant="info">
          <div style={{ display: 'flex' }}>
            <>Behov for beredskap er ferdig vurdert og du kan gå videre i vurderingen.</>
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

export default BeredskapsperiodeoversiktMessages;
