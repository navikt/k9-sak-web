import advarselImageUrl from '@k9-sak-web/assets/images/advarsel.svg';
import { BodyShort, Button, HGrid, Heading, Modal } from '@navikt/ds-react';
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
        <HGrid gap="1" columns={{ xs: '1fr 8fr 2fr' }}>
          <div className="relative">
            <Image className={styles.image} alt={bodyText} src={advarselImageUrl} />
            <div className={styles.divider} />
          </div>
          <div className={styles.text}>
            {headerText && (
              <Heading size="small" level="2">
                {headerText}
              </Heading>
            )}
            <BodyShort size="small">{bodyText}</BodyShort>
          </div>
          <div>
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
          </div>
        </HGrid>
      </Modal.Body>
    </Modal>
  );
};

export default AdvarselModal;
