import { Alert, Box, Button, HStack } from '@navikt/ds-react';
import BeredskapType from '../../../../types/BeredskapType';
import { getStringMedPerioder } from '../../../../util/periodUtils';
import React from 'react';

interface BeredskapsperiodeoversiktMessagesProps {
  beredskapData: BeredskapType;
  skalViseFortsettUtenEndring: boolean;
  fortsettUtenEndring: () => void;
}

const BeredskapsperiodeoversiktMessages = ({
  beredskapData,
  skalViseFortsettUtenEndring,
  fortsettUtenEndring,
}: BeredskapsperiodeoversiktMessagesProps) => {
  if (!beredskapData.harPerioder()) {
    return <p>Søker har ikke oppgitt at det er behov for beredskap.</p>;
  }
  if (beredskapData.harPerioderTilVurdering()) {
    const perioderTilVurdering = beredskapData.finnPerioderTilVurdering().map(({ periode }) => periode);
    return (
      <Box.New>
        <Alert size="small" variant="warning">
          {`Vurder behov for beredskap i ${getStringMedPerioder(perioderTilVurdering)}.`}
        </Alert>
      </Box.New>
    );
  } else if (skalViseFortsettUtenEndring) {
    return (
      <Alert size="small" data-testid="nattevåk-ferdig" variant="info">
        <HStack gap="space-32" align="center">
          Behov for beredskap er ferdig vurdert og du kan gå videre i vurderingen.
          <Button
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

export default BeredskapsperiodeoversiktMessages;
