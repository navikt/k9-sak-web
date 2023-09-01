import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import FlexColumn from './flexGrid/FlexColumn';
import FlexContainer from './flexGrid/FlexContainer';
import FlexRow from './flexGrid/FlexRow';
import VerticalSpacer from './VerticalSpacer';

import styles from './okAvbrytModal.css';

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
    isOpen={showModal}
    closeButton
    contentLabel={text || intl.formatMessage({ id: textCode })}
    onRequestClose={cancel}
    shouldCloseOnOverlayClick={false}
  >
    <Normaltekst>{text || <FormattedMessage id={textCode} />}</Normaltekst>
    <VerticalSpacer fourtyPx />
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
  </Modal>
);

export default injectIntl(OkAvbrytModal);
