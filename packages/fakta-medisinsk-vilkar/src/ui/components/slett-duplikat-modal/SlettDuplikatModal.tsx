import { post } from '@navikt/k9-http-utils';
import { Box, Margin, PageError } from '@navikt/k9-react-components';
import axios from 'axios';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useMemo, useState } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import scrollUp from '../../../util/viewUtils';
import ContainerContext from '../../context/ContainerContext';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import styles from './slettDuplikatModal.less';

interface SlettDuplikatModalProps {
    handleCloseModal: () => void;
    selectedDocument: Dokument;
    onRemove: () => void;
}

const SlettDuplikatModal = ({ handleCloseModal, selectedDocument, onRemove }: SlettDuplikatModalProps): JSX.Element => {
    const { httpErrorHandler } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [removeDuplikatFeilet, setRemoveDuplikatFeilet] = useState(false);

    React.useEffect(
        () => () => {
            httpCanceler.cancel();
        },
        []
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
            cancelToken: httpCanceler.token,
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
            }
        );
    };
    return (
        <Modal isOpen closeButton onRequestClose={handleCloseModal} contentLabel="Fjern som duplikat">
            <ModalFormWrapper title="Fjern som duplikat">
                <Normaltekst>
                    Når du fjerner et dokument som duplikat vil det bli lagt som et eget dokument i listen.
                </Normaltekst>
                {removeDuplikatFeilet && (
                    <Box marginTop={Margin.medium}>
                        <PageError message="Noe gikk galt, vennligst prøv igjen senere" />
                    </Box>
                )}
                <div className={styles.buttonContainer}>
                    <Hovedknapp
                        id="submitButton"
                        onClick={(e) => {
                            e.preventDefault();
                            removeDuplikatreferanse();
                        }}
                        spinner={isSubmitting}
                        disabled={isSubmitting}
                        autoDisableVedSpinner
                    >
                        Fjern som duplikat
                    </Hovedknapp>
                    <div className={styles.cancelButton}>
                        <Knapp htmlType="button" onClick={handleCloseModal}>
                            Avbryt
                        </Knapp>
                    </div>
                </div>
            </ModalFormWrapper>
        </Modal>
    );
};
export default SlettDuplikatModal;
