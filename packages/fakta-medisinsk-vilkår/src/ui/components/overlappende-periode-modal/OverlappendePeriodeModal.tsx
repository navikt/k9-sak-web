import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { PeriodeMedEndring } from '../../../types/PeriodeMedEndring';
import ConfirmationModal from '../confirmation-modal/ConfirmationModal';

interface OverlappendePeriodeModalProps {
  perioderMedEndring: PeriodeMedEndring[];
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  isSubmitting: boolean;
}

const renderInfoMsg = ({ periode }: PeriodeMedEndring) => (
  <Box key={periode.fom} marginBottom={Margin.medium}>
    <Alert size="small" variant="info">
      {`${periode.prettifyPeriod()} overlapper med en tidligere vurdert periode lagt til i denne behandlingen. Den nye
        vurderingen vil erstatte den gamle.`}
    </Alert>
  </Box>
);

const renderWarningMsg = ({ periode }: PeriodeMedEndring) => (
  <Box key={periode.fom} marginBottom={Margin.medium}>
    <Alert size="small" variant="warning">
      {`${periode.prettifyPeriod()} overlapper med en tidligere vurdert periode. Dersom ny vurdering medfører endring i
        resultat vil det bli sendt melding om nytt vedtak til bruker. Dette vil også gjelde eventuelle andre parter.`}
    </Alert>
  </Box>
);

const OverlappendePeriodeModal = ({
  perioderMedEndring,
  onConfirm,
  onCancel,
  isOpen,
  isSubmitting,
}: OverlappendePeriodeModalProps): JSX.Element => {
  const overlappendePerioderISammeBehandling =
    perioderMedEndring.filter(({ endrerVurderingSammeBehandling }) => endrerVurderingSammeBehandling === true) || [];
  const overlappendePerioderIAndreBehandlinger =
    perioderMedEndring.filter(({ endrerAnnenVurdering }) => endrerAnnenVurdering === true) || [];

  const harFlerePerioderMedOverlapp = perioderMedEndring.length > 1;

  return (
    <ConfirmationModal onConfirm={onConfirm} onCancel={onCancel} isOpen={isOpen} isSubmitting={isSubmitting}>
      <Heading level="1" size="medium">
        Overlappende periode
      </Heading>
      <Box marginTop={Margin.large}>
        {overlappendePerioderISammeBehandling.map(renderInfoMsg)}
        {overlappendePerioderIAndreBehandlinger.map(renderWarningMsg)}
        <Box marginTop={Margin.large}>
          <BodyShort size="small">
            {`Er du sikker på at du vil erstatte ${
              harFlerePerioderMedOverlapp ? 'de tidligere vurderte periodene' : 'den tidligere vurderte perioden'
            }?`}
          </BodyShort>
        </Box>
      </Box>
    </ConfirmationModal>
  );
};

export default OverlappendePeriodeModal;
