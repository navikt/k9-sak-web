import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail, HGrid, Modal } from '@navikt/ds-react';
import React from 'react';
import styles from './errorMessageDetailsModal.module.css';
import type { Feilmelding } from './feilmeldingTsType';

const capitalizeFirstLetters = (key: string): string => key.charAt(0).toUpperCase() + key.substr(1);

interface OwnProps {
  showModal: boolean;
  closeModalFn: () => void;
  errorDetails: Feilmelding['additionalInfo'];
}

/**
 * ErrorMessageDetailsModal
 *
 * Presentasjonskomponent. Modal som viser en feildetaljer.
 */
const ErrorMessageDetailsModal = ({ showModal, closeModalFn, errorDetails }: OwnProps) => (
  <Modal
    className={styles.modal}
    open={showModal}
    aria-label="Detaljert informasjon"
    onClose={closeModalFn}
    header={{
      heading: 'Detaljert informasjon',
      closeButton: false,
      icon: (
        <ExclamationmarkTriangleFillIcon
          style={{ color: 'var(--ac-alert-icon-warning-color,var(--a-icon-warning))' }}
        />
      ),
    }}
  >
    <Modal.Body>
      <div className="ml-7">
        {errorDetails &&
          Object.keys(errorDetails).map(edKey => (
            <React.Fragment key={edKey}>
              <Detail>{`${capitalizeFirstLetters(edKey)}:`}</Detail>
              <div className={styles.detail}>
                <BodyShort size="small">{errorDetails[edKey as keyof typeof errorDetails]}</BodyShort>
              </div>
              <div className="mt-2" />
            </React.Fragment>
          ))}
      </div>
      <HGrid gap="1" columns={{ xs: '12fr' }}>
        <Button variant="secondary" className={styles.cancelButton} size="small" type="reset" onClick={closeModalFn}>
          Lukk
        </Button>
      </HGrid>
    </Modal.Body>
  </Modal>
);

export default ErrorMessageDetailsModal;
