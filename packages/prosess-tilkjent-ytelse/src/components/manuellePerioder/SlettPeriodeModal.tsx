import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import moment from 'moment';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Modal } from '@navikt/ds-react';
import styles from './periode.module.css';

interface OwnProps {
  showModal?: boolean;
  periode: any;
  closeEvent: (...args: any[]) => any;
  cancelEvent: (...args: any[]) => any;
}

export const SlettPeriodeModal = ({ showModal, periode, closeEvent, cancelEvent }: OwnProps) => {
  const intl = useIntl();

  const fom = moment(periode.fom).format(DDMMYYYY_DATE_FORMAT);
  const tom = moment(periode.tom).format(DDMMYYYY_DATE_FORMAT);

  return (
    <Modal className={styles.modal} open={showModal} aria-label="Perioden slettes" onClose={closeEvent}>
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
              <Normaltekst className={styles.modalLabel}>
                <FormattedMessage id="TilkjentYtelse.PeriodenSlettes" values={{ fom, tom }} />
              </Normaltekst>
            </FlexColumn>
          </FlexRow>

          <FlexRow>
            <FlexColumn className={styles.right}>
              <VerticalSpacer eightPx />
              <Hovedknapp mini className={styles.button} onClick={closeEvent}>
                {intl.formatMessage({ id: 'TilkjentYtelse.Ok' })}
              </Hovedknapp>
              <Knapp mini onClick={cancelEvent}>
                {intl.formatMessage({ id: 'TilkjentYtelse.Avbryt' })}
              </Knapp>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </Modal.Body>
    </Modal>
  );
};

SlettPeriodeModal.defaultProps = {
  showModal: false,
};

export default SlettPeriodeModal;
