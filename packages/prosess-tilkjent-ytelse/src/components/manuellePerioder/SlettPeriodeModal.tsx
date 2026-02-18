import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { BeriketBeregningsresultatPeriode } from './FormState';
import styles from './periode.module.css';

interface OwnProps {
  showModal?: boolean;
  periode: BeriketBeregningsresultatPeriode;
  closeEvent: () => void;
  cancelEvent: () => void;
}

const SlettPeriodeModal = ({ showModal = false, closeEvent, cancelEvent }: OwnProps) => {
  return (
    <Modal className={styles.modal} open={showModal} aria-label="Perioden slettes" onClose={cancelEvent}>
      <Modal.Body>
        <FlexContainer wrap>
          <FlexRow>
            <FlexColumn className={styles.iconContainer}>
              <Image className={styles.icon} src={innvilgetImageUrl} alt="Ok" />
            </FlexColumn>
            <FlexColumn className={styles.fullWidth}>
              <BodyShort size="small" className={styles.modalLabel}>
                Perioden vil bli slettet
              </BodyShort>
            </FlexColumn>
          </FlexRow>

          <FlexRow>
            <FlexColumn className={styles.right}>
              <VerticalSpacer eightPx />
              <Button variant="primary" size="small" className={styles.button} onClick={closeEvent} type="button">
                Ok
              </Button>
              <Button variant="secondary" size="small" onClick={cancelEvent} type="button">
                Avbryt
              </Button>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </Modal.Body>
    </Modal>
  );
};

export default SlettPeriodeModal;
