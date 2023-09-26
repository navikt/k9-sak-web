import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';

import styles from './henlagtBehandlingModal.module.css';

interface OwnProps {
  showModal: boolean;
  closeEvent: () => void;
}

/**
 * HenlagtBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir saksbehandler tatt tilbake til sokesiden.
 */
const HenlagtBehandlingModal = ({ intl, showModal, closeEvent }: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'HenlagtBehandlingModal.ModalDescription' })}
    onRequestClose={closeEvent}
    shouldCloseOnOverlayClick={false}
  >
    <Row>
      <Column xs="1">
        <Image
          className={styles.image}
          alt={intl.formatMessage({ id: 'HenlagtBehandlingModal.Henlagt' })}
          src={innvilgetImageUrl}
        />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Element>
          <FormattedMessage id="HenlagtBehandlingModal.BehandlingenErHenlagt" />
        </Element>
        <Normaltekst>
          <FormattedMessage id="HenlagtBehandlingModal.RutetTilForsiden" />
        </Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp mini className={styles.button} onClick={closeEvent} autoFocus>
          {intl.formatMessage({ id: 'HenlagtBehandlingModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);

export default injectIntl(HenlagtBehandlingModal);
