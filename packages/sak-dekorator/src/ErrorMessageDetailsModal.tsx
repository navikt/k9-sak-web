import infoImageUrl from '@fpsak-frontend/assets/images/behandle.svg';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Button, Heading, Modal } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './errorMessageDetailsModal.module.css';
import Feilmelding from './feilmeldingTsType';

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
const ErrorMessageDetailsModal = ({
  intl,
  showModal,
  closeModalFn,
  errorDetails,
}: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    open={showModal}
    aria-label={intl.formatMessage({ id: 'ErrorMessageDetailsModal.ErrorDetails' })}
    onClose={closeModalFn}
  >
    <Modal.Header closeButton={false}>
      <Row>
        <Column xs="1">
          <Image className={styles.image} src={infoImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="10" className={styles.text}>
          <Heading size="small" level="2">
            <FormattedMessage id="ErrorMessageDetailsModal.ErrorDetails" />
          </Heading>
        </Column>
      </Row>
    </Modal.Header>
    <Modal.Body>
      <Row>
        <Column xs="1" />
        <Column xs="11">
          {Object.keys(errorDetails).map(edKey => (
            <React.Fragment key={edKey}>
              <Undertekst>{`${capitalizeFirstLetters(edKey)}:`}</Undertekst>
              <div className={styles.detail}>
                <Normaltekst>{errorDetails[edKey]}</Normaltekst>
              </div>
              <VerticalSpacer eightPx />
            </React.Fragment>
          ))}
        </Column>
      </Row>
      <Row>
        <Column xs="12">
          <Button variant="secondary" className={styles.cancelButton} size="small" type="reset" onClick={closeModalFn}>
            <FormattedMessage id="ErrorMessageDetailsModal.Close" />
          </Button>
        </Column>
      </Row>
    </Modal.Body>
  </Modal>
);

export default injectIntl(ErrorMessageDetailsModal);
