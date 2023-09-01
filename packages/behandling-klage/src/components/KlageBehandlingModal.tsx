import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';

import styles from './klageBehandlingModal.css';

interface OwnProps {
  visModal?: boolean;
  lukkModal: () => void;
}

/**
 * KlageVurderingModal
 *
 * Presentasjonskomponent. Denne komponenten vises ved en klagevurdering hvor saksbehandler
 * i aksjonspunkt '' velger at ytelsesvedtaket skal stadfestes. Ved å trykke på knapp blir saksbehandler
 * tatt tilbake til sokesiden.
 */
const KlageVurderingModal = ({ visModal = false, lukkModal, intl }: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    isOpen={visModal}
    contentLabel={intl.formatMessage({ id: 'KlageVurderingModal.ModalDescription' })}
    onRequestClose={lukkModal}
    closeButton={false}
    shouldCloseOnOverlayClick={false}
  >
    <Row className="">
      <Column xs="1">
        <Image className={styles.image} src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Normaltekst>
          <FormattedMessage id="KlageVurderingModal.VedtakOversendt" />
        </Normaltekst>
        <Normaltekst>
          <FormattedMessage id="KlageVurderingModal.GoToSearchPage" />
        </Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp mini className={styles.button} onClick={lukkModal} autoFocus>
          {intl.formatMessage({ id: 'KlageVurderingModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);

export default injectIntl(KlageVurderingModal);
