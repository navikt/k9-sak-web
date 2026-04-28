import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { FormattedMessage, useIntl } from 'react-intl';
import FlexColumn from './flexGrid/FlexColumn';
import FlexContainer from './flexGrid/FlexContainer';
import FlexRow from './flexGrid/FlexRow';
import styles from './okAvbrytModal.module.css';

interface OwnProps {
  textCode?: string;
  text?: string;
  okButtonTextCode?: string;
  showModal: boolean;
  submit: () => void;
  cancel: () => void;
  isSubmitting?: boolean;
}

/**
 * OkAvbrytModal
 *
 * Presentasjonskomponent. Modal som viser en valgfri tekst i tillegg til knappene OK og Avbryt.
 */
const OkAvbrytModal = ({
  textCode,
  text,
  okButtonTextCode = 'OkAvbrytModal.Ok',
  showModal,
  cancel,
  submit,
  isSubmitting = false,
}: OwnProps) => {
  const intl = useIntl();
  return (
  <Modal
    className={styles.modal}
    open={showModal}
    aria-label={text || intl.formatMessage({ id: textCode })}
    onClose={cancel}
  >
    <Modal.Header>
      <BodyShort size="small">{text || <FormattedMessage id={textCode} />}</BodyShort>
    </Modal.Header>
    <Modal.Body>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Button variant="primary" size="small" type="submit" onClick={submit} autoFocus disabled={isSubmitting} loading={isSubmitting}>
              {intl.formatMessage({ id: okButtonTextCode })}
            </Button>
          </FlexColumn>
          <FlexColumn>
            <Button variant="secondary" size="small" type="reset" onClick={cancel}>
              {intl.formatMessage({ id: 'OkAvbrytModal.Avbryt' })}
            </Button>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </Modal.Body>
  </Modal>
  );
};

export default OkAvbrytModal;
