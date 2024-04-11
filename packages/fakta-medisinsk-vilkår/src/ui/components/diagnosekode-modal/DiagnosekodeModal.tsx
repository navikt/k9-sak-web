import { Button, Modal } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React, { useEffect } from 'react';
import type { DiagnosekodeSearcherPromise } from '../../../util/diagnosekodeSearcher';
import DiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import styles from '../diagnosekodeoversikt/diagnosekodeoversikt.module.css';

interface DiagnosekodeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSaveClick: (diagnosekoder: string[]) => Promise<unknown>;
  searcherPromise: DiagnosekodeSearcherPromise;
}

const DiagnosekodeModal = ({
  isOpen,
  onRequestClose,
  onSaveClick,
  searcherPromise,
}: DiagnosekodeModalProps): JSX.Element => {
  const [selectedDiagnosekoder, setSelectedDiagnosekoder] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [renderDiagnosekodeSelektor, setRenderDiagnosekodeSelektor] = React.useState(false);

  useEffect(() => {
    setRenderDiagnosekodeSelektor(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setSelectedDiagnosekoder([]);
    onRequestClose();
  };

  return (
    <Modal
      open={isOpen}
      header={{ heading: 'Legg til diagnosekoder', closeButton: false }}
      onClose={onRequestClose}
      className={styles.diagnosekodeoversikt__modal}
    >
      <Modal.Body>
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            setIsSubmitting(true);
            onSaveClick(selectedDiagnosekoder).then(
              () => setTimeout(() => setIsSubmitting(false), 2500),
              () => setTimeout(() => setIsSubmitting(false), 2500),
            );
            setSelectedDiagnosekoder([]);
          }}
        >
          <Box marginTop={Margin.large}>
            {renderDiagnosekodeSelektor && (
              <DiagnosekodeSelector
                initialDiagnosekodeValue=""
                name="diagnosekode"
                onChange={diagnosekoder => {
                  setSelectedDiagnosekoder(diagnosekoder);
                }}
                label="Diagnosekode"
                selectedDiagnosekoder={selectedDiagnosekoder}
                hideLabel
                searcherPromise={searcherPromise}
              />
            )}
          </Box>
          <Box marginTop={Margin.xLarge}>
            <div style={{ display: 'flex' }}>
              <Button
                size="small"
                disabled={isSubmitting}
                loading={isSubmitting}
                id="bekreftDiagnosekodeKnapp"
                type="submit"
              >
                Bekreft
              </Button>
              <Button
                variant="secondary"
                size="small"
                style={{ marginLeft: '1rem' }}
                onClick={handleClose}
                disabled={isSubmitting}
                type="button"
              >
                Avbryt
              </Button>
            </div>
          </Box>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DiagnosekodeModal;
