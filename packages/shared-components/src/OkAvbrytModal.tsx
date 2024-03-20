import { Modal } from '@navikt/ds-react';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
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
  intl,
}: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    open={showModal}
    aria-label={text || intl.formatMessage({ id: textCode })}
    onClose={cancel}
  >
    <Modal.Header>
      <Normaltekst>{text || <FormattedMessage id={textCode} />}</Normaltekst>
    </Modal.Header>
    {/* <VerticalSpacer fourtyPx /> */}
    <Modal.Body>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Hovedknapp mini htmlType="submit" onClick={submit} autoFocus>
              {intl.formatMessage({ id: okButtonTextCode })}
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp mini htmlType="reset" onClick={cancel}>
              {intl.formatMessage({ id: 'OkAvbrytModal.Avbryt' })}
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </Modal.Body>
  </Modal>
);

export default injectIntl(OkAvbrytModal);
