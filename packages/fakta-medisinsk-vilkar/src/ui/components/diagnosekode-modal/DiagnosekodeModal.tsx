import { Box, Margin } from '@navikt/k9-react-components';
import React from 'react';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import styles from '../diagnosekodeoversikt/diagnosekodeoversikt.less';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import DiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import Diagnosekode from '../../../types/Diagnosekode';

interface DiagnosekodeModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSaveClick: (nyDiagnosekode: Diagnosekode) => Promise<unknown>;
}

const DiagnosekodeModal = ({ isOpen, onRequestClose, onSaveClick }: DiagnosekodeModalProps): JSX.Element => {
    const [selectedDiagnosekode, setSelectedDiagnosekode] = React.useState<Diagnosekode>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    return (
        <Modal
            isOpen={isOpen}
            closeButton
            onRequestClose={onRequestClose}
            contentLabel="Legg til diagnosekode"
            className={styles.diagnosekodeoversikt__modal}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsSubmitting(true);
                    onSaveClick(selectedDiagnosekode).then(
                        () => setIsSubmitting(false),
                        () => setIsSubmitting(false)
                    );
                }}
            >
                <ModalFormWrapper title="Legg til diagnosekode">
                    <Box marginTop={Margin.large}>
                        <DiagnosekodeSelector
                            initialDiagnosekodeValue=""
                            name="diagnosekode"
                            onChange={({ key, value }) => {
                                setSelectedDiagnosekode({ kode: key, beskrivelse: value });
                            }}
                            label="Diagnosekode"
                            hideLabel
                            showSpinner
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <div style={{ display: 'flex' }}>
                            <Hovedknapp mini disabled={isSubmitting} spinner={isSubmitting}>
                                Bekreft
                            </Hovedknapp>
                            <Knapp
                                mini
                                style={{ marginLeft: '1rem' }}
                                htmlType="button"
                                onClick={onRequestClose}
                                disabled={isSubmitting}
                            >
                                Avbryt
                            </Knapp>
                        </div>
                    </Box>
                </ModalFormWrapper>
            </form>
        </Modal>
    );
};

export default DiagnosekodeModal;
