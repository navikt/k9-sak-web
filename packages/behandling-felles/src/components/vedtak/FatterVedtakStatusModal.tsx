import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import styles from './fatterVedtakStatusModal.module.css';

interface OwnProps {
  visModal?: boolean;
  lukkModal: () => void;
  tekstkode: string;
}

/**
 * FatterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen viser en lightbox etter at en saksbehandler har sendt et forslag på vedtak til beslutter
 * ved totrinnskontroll. Ved å trykke på knapp blir saksbehandler tatt tilbake til søkesiden.
 */
const FatterVedtakStatusModal = ({
  intl,
  visModal = false,
  lukkModal,
  tekstkode,
}: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    open={visModal}
    aria-label={intl.formatMessage({ id: tekstkode })}
    onClose={lukkModal}
  >
    <Modal.Body>
      <Row className="">
        <Column xs="1">
          <Image className={styles.image} alt={intl.formatMessage({ id: tekstkode })} src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <BodyShort size="small">
            <FormattedMessage id={tekstkode} />
          </BodyShort>
          <BodyShort size="small">
            <FormattedMessage id="FatterVedtakStatusModal.GoToSearchPage" />
          </BodyShort>
        </Column>
        <Column xs="2">
          <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
            {intl.formatMessage({ id: 'FatterVedtakStatusModal.Ok' })}
          </Button>
        </Column>
      </Row>
    </Modal.Body>
  </Modal>
);

export default injectIntl(FatterVedtakStatusModal);
