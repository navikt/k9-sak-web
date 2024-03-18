import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';

import { Modal } from '@navikt/ds-react';
import styles from './ankeBehandlingModal.module.css';

interface OwnProps {
  visModal?: boolean;
  lukkModal: () => void;
  erFerdigbehandlet: boolean;
}

/**
 * AnkeVurderingModal
 *
 * Presentasjonskomponent. Denne komponenten vises ved en ankevurdering hvor saksbehandler
 * i aksjonspunkt '' velger at ytelsesvedtaket skal stadfestes. Ved å trykke på knapp blir saksbehandler
 * tatt tilbake til sokesiden.
 */
const AnkeVurderingModal = ({
  visModal = false,
  lukkModal,
  erFerdigbehandlet,
  intl,
}: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    open={visModal}
    aria-label={intl.formatMessage({ id: 'AnkeVurderingModal.ModalDescription' })}
    onClose={lukkModal}
  >
    <Modal.Body>
      <Row className="">
        <Column xs="1">
          <Image className={styles.image} src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage
              id={erFerdigbehandlet ? 'AnkeVurderingModal.Ferdigbehandlet' : 'AnkeVurderingModal.VedtakOversendt'}
            />
          </Normaltekst>
          <Normaltekst>
            <FormattedMessage id="AnkeVurderingModal.GoToSearchPage" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Hovedknapp mini className={styles.button} onClick={lukkModal} autoFocus>
            {intl.formatMessage({ id: 'AnkeVurderingModal.Ok' })}
          </Hovedknapp>
        </Column>
      </Row>
    </Modal.Body>
  </Modal>
);

export default injectIntl(AnkeVurderingModal);
