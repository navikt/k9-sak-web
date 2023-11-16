import { Column, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import infoImageUrl from '@fpsak-frontend/assets/images/behandle.svg?react';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import Feilmelding from './feilmeldingTsType';

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
const ErrorMessageDetailsModal = ({
  intl,
  showModal,
  closeModalFn,
  errorDetails,
}: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'ErrorMessageDetailsModal.ErrorDetails' })}
    onRequestClose={closeModalFn}
    shouldCloseOnOverlayClick={false}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} src={infoImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="10" className={styles.text}>
        <Undertittel>
          <FormattedMessage id="ErrorMessageDetailsModal.ErrorDetails" />
        </Undertittel>
      </Column>
    </Row>
    <VerticalSpacer sixteenPx />
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
        <Knapp className={styles.cancelButton} mini htmlType="reset" onClick={closeModalFn}>
          <FormattedMessage id="ErrorMessageDetailsModal.Close" />
        </Knapp>
      </Column>
    </Row>
  </Modal>
);

export default injectIntl(ErrorMessageDetailsModal);
