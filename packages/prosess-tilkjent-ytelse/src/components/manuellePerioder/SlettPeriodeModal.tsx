import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './periode.module.css';

interface OwnProps {
  showModal?: boolean;
  periode: any;
  closeEvent: () => void;
  cancelEvent: () => void;
}

const SlettPeriodeModal = ({ showModal = false, periode, closeEvent, cancelEvent }: OwnProps) => {
  const intl = useIntl();

  const fom = moment(periode.fom).format(DDMMYYYY_DATE_FORMAT);
  const tom = moment(periode.tom).format(DDMMYYYY_DATE_FORMAT);

  return (
    <Modal className={styles.modal} open={showModal} aria-label="Perioden slettes" onClose={cancelEvent}>
      <Modal.Body>
        <FlexContainer wrap>
          <FlexRow>
            <FlexColumn className={styles.iconContainer}>
              <Image
                className={styles.icon}
                src={innvilgetImageUrl}
                alt={intl.formatMessage({ id: 'TilkjentYtelse.Ok' })}
              />
            </FlexColumn>
            <FlexColumn className={styles.fullWidth}>
              <BodyShort size="small" className={styles.modalLabel}>
                <FormattedMessage id="TilkjentYtelse.PeriodenSlettes" values={{ fom, tom }} />
              </BodyShort>
            </FlexColumn>
          </FlexRow>

          <FlexRow>
            <FlexColumn className={styles.right}>
              <VerticalSpacer eightPx />
              <Button variant="primary" size="small" className={styles.button} onClick={closeEvent} type="button">
                {intl.formatMessage({ id: 'TilkjentYtelse.Ok' })}
              </Button>
              <Button variant="secondary" size="small" onClick={cancelEvent} type="button">
                {intl.formatMessage({ id: 'TilkjentYtelse.Avbryt' })}
              </Button>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </Modal.Body>
    </Modal>
  );
};

export default SlettPeriodeModal;
