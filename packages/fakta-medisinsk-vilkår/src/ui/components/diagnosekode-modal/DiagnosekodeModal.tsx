import type { ICD10DiagnosekodeSearcher } from '@k9-sak-web/gui/shared/diagnosekodeVelger/diagnosekodeSearcher.js';
import { Box, Button, Modal } from '@navikt/ds-react';
import React, { useEffect, type JSX } from 'react';
import DiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import styles from '../diagnosekodeoversikt/diagnosekodeoversikt.module.css';

interface DiagnosekodeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSaveClick: (diagnosekoder: string[]) => Promise<unknown>;
  searcher: ICD10DiagnosekodeSearcher;
}

const DiagnosekodeModal = ({ isOpen, onRequestClose, onSaveClick, searcher }: DiagnosekodeModalProps): JSX.Element => {
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
      header={{ heading: 'Legg til diagnosekoder', closeButton: true }}
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
          <Box.New marginBlock="6 0">
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
                searcher={searcher}
              />
            )}
          </Box.New>
          <Box.New marginBlock="8 0">
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
          </Box.New>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DiagnosekodeModal;
