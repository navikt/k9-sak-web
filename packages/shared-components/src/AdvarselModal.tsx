import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel.svg';
import { Button, Heading, Modal } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import getPackageIntl from '../i18n/getPackageIntl';
import Image from './Image';
import styles from './advarselModal.module.css';

interface OwnProps {
  headerText?: string;
  bodyText: string;
  showModal: boolean;
  submit: () => void;
}

/**
 * AdvarselModal
 *
 * Presentasjonskomponent. Modal med advarselikon og som viser en valgfri tekst i tillegg til knappen OK.
 */
const AdvarselModal = ({ bodyText, headerText, showModal, submit }: OwnProps) => {
  const intl = getPackageIntl();
  return (
    <Modal className={styles.modal} open={showModal} aria-label={bodyText} onClose={submit}>
      <Modal.Body>
        <Row>
          <Column xs="1">
            <Image className={styles.image} alt={bodyText} src={advarselImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="8" className={styles.text}>
            {headerText && (
              <Heading size="small" level="2">
                {headerText}
              </Heading>
            )}
            <Normaltekst>{bodyText}</Normaltekst>
          </Column>
          <Column xs="2">
            <Button
              variant="primary"
              className={styles.submitButton}
              size="small"
              type="submit"
              onClick={submit}
              autoFocus
            >
              {intl.formatMessage({ id: 'AdvarselModal.Ok' })}
            </Button>
          </Column>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AdvarselModal;
