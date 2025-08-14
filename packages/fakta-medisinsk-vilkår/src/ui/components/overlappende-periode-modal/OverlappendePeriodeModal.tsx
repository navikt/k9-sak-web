import { Alert, BodyShort, Box, Heading } from '@navikt/ds-react';
import { type JSX } from 'react';
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
  <Box.New key={periode.fom} marginBlock="0 4">
    <Alert size="small" variant="info">
      {`${periode.prettifyPeriod()} overlapper med en tidligere vurdert periode lagt til i denne behandlingen. Den nye
        vurderingen vil erstatte den gamle.`}
    </Alert>
  </Box.New>
);

const renderWarningMsg = ({ periode }: PeriodeMedEndring) => (
  <Box.New key={periode.fom} marginBlock="0 4">
    <Alert size="small" variant="warning">
      {`${periode.prettifyPeriod()} overlapper med en tidligere vurdert periode. Dersom ny vurdering medfører endring i
        resultat vil det bli sendt melding om nytt vedtak til bruker. Dette vil også gjelde eventuelle andre parter.`}
    </Alert>
  </Box.New>
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
      <Box.New marginBlock="6 0">
        {overlappendePerioderISammeBehandling.map(renderInfoMsg)}
        {overlappendePerioderIAndreBehandlinger.map(renderWarningMsg)}
        <Box.New marginBlock="6 0">
          <BodyShort size="small">
            {`Er du sikker på at du vil erstatte ${
              harFlerePerioderMedOverlapp ? 'de tidligere vurderte periodene' : 'den tidligere vurderte perioden'
            }?`}
          </BodyShort>
        </Box.New>
      </Box.New>
    </ConfirmationModal>
  );
};

export default OverlappendePeriodeModal;
