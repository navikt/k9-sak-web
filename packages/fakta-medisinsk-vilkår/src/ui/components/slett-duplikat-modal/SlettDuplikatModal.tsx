import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { Box, Margin, PageError } from '@navikt/ft-plattform-komponenter';
import { post } from '@fpsak-frontend/utils';
import React, { useMemo, useState } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import scrollUp from '../../../util/viewUtils';
import ContainerContext from '../../context/ContainerContext';
import styles from './slettDuplikatModal.module.css';

interface SlettDuplikatModalProps {
  handleCloseModal: () => void;
  selectedDocument: Dokument;
  onRemove: () => void;
}

const SlettDuplikatModal = ({ handleCloseModal, selectedDocument, onRemove }: SlettDuplikatModalProps): JSX.Element => {
  const { httpErrorHandler } = React.useContext(ContainerContext);
  const controller = useMemo(() => new AbortController(), []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removeDuplikatFeilet, setRemoveDuplikatFeilet] = useState(false);

  React.useEffect(
    () => () => {
      controller.abort();
    },
    [],
  );
  const removeDuplikatreferanse = () => {
    const endreDkumentLink = findLinkByRel(LinkRel.ENDRE_DOKUMENT, selectedDocument.links);
    const { href, requestPayload } = endreDkumentLink;

    const dokumentUtenDuplikat = {
      ...selectedDocument,
      duplikatAvId: null,
    };
    setRemoveDuplikatFeilet(false);
    setIsSubmitting(true);
    post(href, { ...requestPayload, ...dokumentUtenDuplikat }, httpErrorHandler, {
      signal: controller.signal,
    }).then(
      () => {
        setIsSubmitting(false);
        scrollUp();
        onRemove();
      },
      () => {
        setIsSubmitting(false);
        scrollUp();
        setRemoveDuplikatFeilet(true);
      },
    );
  };
  return (
    <Modal open header={{ heading: 'Fjern som duplikat', closeButton: true }} onClose={handleCloseModal}>
      <Modal.Body>
        <BodyShort size="small">
          Når du fjerner et dokument som duplikat vil det bli lagt som et eget dokument i listen.
        </BodyShort>
        {removeDuplikatFeilet && (
          <Box marginTop={Margin.medium}>
            <PageError message="Noe gikk galt, vennligst prøv igjen senere" />
          </Box>
        )}
        <div className={styles.buttonContainer}>
          <Button
            id="submitButton"
            onClick={e => {
              e.preventDefault();
              removeDuplikatreferanse();
            }}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Fjern som duplikat
          </Button>
          <div className={styles.cancelButton}>
            <Button variant="secondary" onClick={handleCloseModal}>
              Avbryt
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default SlettDuplikatModal;
