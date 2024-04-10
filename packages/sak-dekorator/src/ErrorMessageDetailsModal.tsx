import infoImageUrl from '@fpsak-frontend/assets/images/behandle.svg';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Button, Detail, HGrid, Heading, Modal } from '@navikt/ds-react';
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
      <HGrid gap="1" columns={{ xs: '1fr 10fr 1fr' }}>
        <div>
          <Image className={styles.image} src={infoImageUrl} />
          <div className={styles.divider} />
        </div>
        <div className={styles.text}>
          <Heading size="small" level="2">
            <FormattedMessage id="ErrorMessageDetailsModal.ErrorDetails" />
          </Heading>
        </div>
      </HGrid>
    </Modal.Header>
    <Modal.Body>
      <HGrid gap="1" columns={{ xs: '1fr 11fr' }}>
        <div />
        <div>
          {Object.keys(errorDetails).map(edKey => (
            <React.Fragment key={edKey}>
              <Detail>{`${capitalizeFirstLetters(edKey)}:`}</Detail>
              <div className={styles.detail}>
                <BodyShort size="small">{errorDetails[edKey]}</BodyShort>
              </div>
              <VerticalSpacer eightPx />
            </React.Fragment>
          ))}
        </div>
      </HGrid>
      <HGrid gap="1" columns={{ xs: '12fr' }}>
        <Button variant="secondary" className={styles.cancelButton} size="small" type="reset" onClick={closeModalFn}>
          <FormattedMessage id="ErrorMessageDetailsModal.Close" />
        </Button>
      </HGrid>
    </Modal.Body>
  </Modal>
);

export default injectIntl(ErrorMessageDetailsModal);
