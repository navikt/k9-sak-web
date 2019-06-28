import React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Image } from '@fpsak-frontend/shared-components';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './ankeBehandlingModal.less';

/**
 * AnkeVurderingModal
 *
 * Presentasjonskomponent. Denne komponenten vises ved en klagevurdering hvor saksbehandler
 * i aksjonspunkt '' velger at ytelsesvedtaket skal stadfestes. Ved å trykke på knapp blir saksbehandler
 * tatt tilbake til sokesiden.
 */
const AnkeVurderingModal = ({
  showModal,
  closeEvent,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    contentLabel={intl.formatMessage({ id: 'AnkeVurderingModal.ModalDescription' })}
    onRequestClose={closeEvent}
    closeButton={false}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Normaltekst><FormattedMessage id="AnkeVurderingModal.VedtakOversendt" /></Normaltekst>
        <Normaltekst><FormattedMessage id="AnkeVurderingModal.GoToSearchPage" /></Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          mini
          className={styles.button}
          onClick={closeEvent}
          autoFocus
        >
          {intl.formatMessage({ id: 'AnkeVurderingModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);


AnkeVurderingModal.propTypes = {
  showModal: PropTypes.bool,
  closeEvent: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

AnkeVurderingModal.defaultProps = {
  showModal: false,
};

export default injectIntl(AnkeVurderingModal);
