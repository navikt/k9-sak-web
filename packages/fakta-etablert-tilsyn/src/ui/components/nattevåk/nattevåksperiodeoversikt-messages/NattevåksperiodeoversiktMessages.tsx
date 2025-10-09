import { Alert, Box, Button, HStack } from '@navikt/ds-react';
import NattevåkType from '../../../../types/NattevåkType';
import { getStringMedPerioder } from '../../../../util/periodUtils';
import React from 'react';

interface NattevåksperiodeoversiktMessagesProps {
  nattevåkData: NattevåkType;
  skalViseFortsettUtenEndring: boolean;
  fortsettUtenEndring: () => void;
}

const NattevåksperiodeoversiktMessages = ({
  nattevåkData,
  skalViseFortsettUtenEndring,
  fortsettUtenEndring,
}: NattevåksperiodeoversiktMessagesProps) => {
  if (!nattevåkData.harPerioder()) {
    return <p>Søker har ikke oppgitt at det er behov for nattevåk.</p>;
  }
  if (nattevåkData.harPerioderTilVurdering()) {
    const perioderTilVurdering = nattevåkData.finnPerioderTilVurdering().map(({ periode }) => periode);
    return (
      <Box.New>
        <Alert size="small" variant="warning">
          {`Vurder behov for nattevåk i ${getStringMedPerioder(perioderTilVurdering)}.`}
        </Alert>
      </Box.New>
    );
  } else if (skalViseFortsettUtenEndring) {
    return (
      <Alert size="small" data-testid="nattevåk-ferdig" variant="info">
        <HStack gap="space-32" align="center">
          Behov for nattevåk er ferdig vurdert og du kan gå videre i vurderingen.
          <Button
            style={{ marginLeft: '2rem' }}
            onClick={fortsettUtenEndring}
            size="small"
            id="gåVidereFraNattevåkKnapp"
          >
            Fortsett
          </Button>
        </HStack>
      </Alert>
    );
  }
  return null;
};

export default NattevåksperiodeoversiktMessages;
