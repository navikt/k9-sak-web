import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail, HGrid, Heading, Modal } from '@navikt/ds-react';
import React from 'react';
import type { Feilmelding } from '../types/Feilmelding';
import styles from './errorMessageDetailsModal.module.css';

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
  <Modal className={styles.modal} open={showModal} aria-label="Detaljert informasjon" onClose={closeModalFn}>
    <Modal.Header closeButton={false}>
      <HGrid gap="1" columns={{ xs: '1fr 10fr 1fr' }}>
        <div className="relative">
          <ExclamationmarkTriangleFillIcon
            fontSize="1.5rem"
            style={{ color: 'var(--ac-alert-icon-warning-color,var(--a-icon-warning))', fontSize: '1.5rem' }}
          />
          <div className={styles.divider} />
        </div>
        <div className={styles.text}>
          <Heading size="small" level="2">
            Detaljert informasjon
          </Heading>
        </div>
      </HGrid>
    </Modal.Header>
    <Modal.Body>
      <HGrid gap="1" columns={{ xs: '1fr 11fr' }}>
        <div />
        <div>
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
      </HGrid>
      <HGrid gap="1" columns={{ xs: '12fr' }}>
        <Button variant="secondary" className={styles.cancelButton} size="small" type="reset" onClick={closeModalFn}>
          Lukk
        </Button>
      </HGrid>
    </Modal.Body>
  </Modal>
);

export default ErrorMessageDetailsModal;
